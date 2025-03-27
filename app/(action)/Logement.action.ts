'use server'
import { prisma } from "@/src/lib/prisma";
import { Logement } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {put} from '@vercel/blob'




export async function CreateLogement(
  categoryLogementId: string,
  option: string[],
  nom: string,
  description: string,
  adresse: string,
  ville: string,
  telephone: string,
  email: string,
  capacity: number,
  hasClim: boolean,
  hasWifi: boolean,
  hasTV: boolean,
  hasKitchen: boolean,
  parking: boolean,
  surface: number,
  extraBed: boolean,
  nbChambres: number,
  price: number,
  images: File[]
) {
  try {

    const user = await currentUser();
    if (!user) throw new Error("Utilisateur non authentifié");


    if (!nom || !email || !ville || !adresse || !telephone || capacity <= 0 || price < 0) {
      throw new Error("Données invalides, veuillez vérifier les champs requis.");
    }
/*
  
    const existingLogement = await prisma.logement.findFirst({
      where: { email },
      select: { id: true },
    });

    if (existingLogement) return { error: "L'email est déjà utilisé" };
*/
   
    const createdLogement = await prisma.logement.create({
      data: {
        userId: user.id,
        nom,
        description,
        adresse,
        ville,
        telephone,
        email,
        capacity,
        hasClim,
        hasWifi,
        hasTV,
        hasKitchen,
        parking,
        surface,
        extraBed,
        nbChambres,
        price,
        categoryLogementId,
      },
    });

    if (!createdLogement) throw new Error("Échec de la création du logement");


    const uploadedImages = await Promise.allSettled(
      images.map(async (file) => {
        try {
          const fileBuffer = Buffer.from(await file.arrayBuffer());
          const blob = await put(file.name, fileBuffer, { access: 'public' });
          return { logementId: createdLogement.id, urlImage: blob.url };
        } catch (err) {
          console.error("Erreur lors de l'upload d'une image :", err);
          return null;
        }
      })
    );

   
    const validImages = uploadedImages
      .filter(result => result.status === "fulfilled" && result.value !== null)
      .map(result => (result as PromiseFulfilledResult<{ logementId: string; urlImage: string }>).value);

    if (validImages.length > 0) {
      await prisma.imageLogement.createMany({ data: validImages });
    }

    if (createdLogement) {
      if (option.length > 0) {
        await prisma.logementOptionOnLogement.createMany({
          data: option.map((optionId) => ({
            logementId: createdLogement.id,
            optionId,
          })),
         
        });
        
      }
    
      const userHasRole = await prisma.userRole.findFirst({
          where: {
              userId: user.id,
              role: { name: 'HOTELIER' }  
          }
      });
  
     
      if (userHasRole) {
          return createdLogement;  
      }
  
     
      const hasRole = await prisma.role.findUnique({
          where: { name: 'HOTELIER' },
          select: { id: true }
      });
  
 
      if (!hasRole) {
          throw new Error("Le rôle 'HOTELIER' n'existe pas dans la base de données.");
      }
  

      await prisma.userRole.create({
          data: {
              userId: user.id,
              roleId: hasRole.id, 
          },
      });
  }
  

    return createdLogement;
  } catch (error: unknown) {
    console.error("Erreur lors de la création du logement :", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Une erreur s'est produite lors de la création du logement");
    } else {
      throw new Error("Une erreur s'est produite lors de la création du logement");
    }
  }
}


export async function getLogement() {
  const logement = await prisma.logement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      categoryLogement:true
      
    },

  });


  return logement;
}
export async function getLogementById(id: string, calculateRate = false) {
  const logement = await prisma.logement.findUnique({
    where: { id },
    include: {
      user: true,
      categoryLogement: true,
      avis: true,
      favorites: true,
      ...(calculateRate && {
        reservations: {
          where: { status: "CONFIRMED" },
        },
      }),
    },
  });

  if (!logement) return null;

  if (calculateRate) {
    // Calcul du taux de réservation
    
    const confirmedReservationsCount = logement.reservations.length;
    const reservationRate = logement.capacity > 0 ? (confirmedReservationsCount / logement.capacity) * 100 : 0;

    // Calcul du taux d'avis (par rapport au nombre d'avis dans l'ensemble du système)
    const totalAvis = await prisma.avis.count(); // Nombre total d'avis pour tous les logements
    const avisRate = totalAvis > 0 ? (logement.avis.length / totalAvis) * 100 : 0;

    // Calcul du taux de favoris (par rapport au nombre total de favoris dans tous les logements)
    const totalFavoris = await prisma.favorite.count(); // Nombre total de favoris pour tous les logements
    const favorisRate = totalFavoris > 0 ? (logement.favorites.length / totalFavoris) * 100 : 0;

    return { ...logement, reservationRate, avisRate, favorisRate };
  }

  return logement;
}
export async function getLogementDetails(id: string) {
  try {
    const logement = await prisma.logement.findUnique({
      where: { id },
      include: {
        user: true,
        categoryLogement: true,  
        favorites: true,
        avis: true,
        reservations: {
          include: {
            user: true,
        },
        },
        logementOptions: {
          include: {
            option: {
              select: { 
                id: true,
                name: true,  
                description: true, 
              }
            }
          }
        },
      },
    });

    if (!logement) {
      throw new Error(`Aucun logement trouvé avec l'ID : ${id}`);
    }

    return logement;
  } catch (error) {
    console.error("Erreur lors de la récupération du logement :", error);
    return null; 
  }
}
export async function RepportReservation(id: string) {
  const logement = await prisma.logement.findUnique({
    where: { id },
    include: {
      reservations: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!logement) return [];

  // Comptage des statuts de réservation
  const statuses: { PENDING: number; CONFIRMÉ: number; CANCELLED: number } = {
    PENDING: 0,
    CONFIRMÉ: 0,
    CANCELLED: 0,
  };

  logement.reservations.forEach((reservation) => {
    if (reservation.status === "PENDING") statuses.PENDING++;
    if (reservation.status ===  "CONFIRMED") statuses.CONFIRMÉ++;
    if (reservation.status === "CANCELLED" ) statuses.CANCELLED++;
  });

  // Préparer les données pour le graphique
  const chartData = Object.entries(statuses)
    .map(([status, count]) => ({
      reservation: status,
      visitors: count,
    }))
    .sort((a, b) => b.visitors - a.visitors);

  // Optionnel : si la somme totale des réservations est 0, renvoyer un tableau vide
  const totalVisitors = chartData.reduce((sum, item) => sum + item.visitors, 0);
  if (totalVisitors === 0) return [];

  return chartData;
}
export async function ReportReservationByMonth(id: string) {
  const reservations = await prisma.reservation.findMany({
    where: {
      logementId: id,
      status: { in: ["CONFIRMED", "CANCELLED"] },
    },
    select: {
      status: true,
      createdAt: true,
    },
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    confirmed: 0,
    cancelled: 0,
  }));

  reservations.forEach((reservation) => {
    const month = new Date(reservation.createdAt).getMonth() + 1;
    if (reservation.status === "CONFIRMED") {
      months[month - 1].confirmed++;
    } else if (reservation.status === "CANCELLED") {
      months[month - 1].cancelled++;
    }
  });

  return months;
}
export async function BlokedLogementAction(id: string) {

  const logement = await prisma.logement.findUnique({
    where: { id },
    select: { isBlocked: true }
  });

  if (!logement) return null; 

 
  const updatedLogement = await prisma.logement.update({
    where: { id },
    data: { isBlocked: !logement.isBlocked },
    select: { isBlocked: true }
  });


  revalidatePath("/dashboard/logement"); 

  return updatedLogement.isBlocked;
}
export async function DeleteLogement(logement:Logement){
  const logementUnique = await prisma.logement.findUnique({
    where: { id:logement.id },
  });

  if (!logementUnique) return null; 
  try{
    const deleteLgt=await prisma.logement.delete({
      where:{
        id:logement.id
      }
      
    })
    if (!deleteLgt) {
      throw new Error("Erreur lors de la suppression de la Logement.");
  }
  }catch(e){
    console.log(e)

  }
}
export async function getDetailsAppartement(logementId:string){
  try {
    const appartement=await prisma.logement.findUnique({
      where:{id:logementId},
      include:{
        user:true,
        avis:true,
        images:true,
       favorites:true, 
        logementOptions:{
          select:{
            option:true
          }
        }
      }
    })
    if(!appartement) return
  
    return appartement

    
  } catch (error) {
    console.error(error)
    throw new Error("Impossible d'afficher les détails de l'appartement")
  }
}

