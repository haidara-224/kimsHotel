'use server'
import { prisma } from "@/src/lib/prisma";
import { Logement } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {del, put} from '@vercel/blob'




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

    const existingLogement = await prisma.logement.findFirst({
      where: { email },
      select: { id: true },
    });

    if (existingLogement) return { error: "L'email est déjà utilisé" };

   
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

    if(createdLogement){
      const clientRole = await prisma.role.findUnique({
        where: { name: "ADMIN" },
      });
    if (!clientRole) {
        throw new Error("Le rôle 'CLIENT' n'existe pas dans la base de données.");
    }
       await prisma.userRoleAppartement.create({
           data:{
               userId:user.id,
               logementId:createdLogement.id,
               roleId:clientRole.id
           }
       })
   }
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

export async function getLogementWithUser() {
  const user_id = await currentUser()
  try {
      const hotel = await prisma.userRoleAppartement.findMany({
          orderBy: { createdAt: "desc" },
          where: {
              userId: user_id?.id
          },
          include: {
       
              logement: {
                include:{
                    user:true
                }},
              role:true

          },

      });


      return hotel;

  } catch (error) {
      console.error("Erreur lors de la récupération des hotels :", error);
      return null;
  }
}
export async function getshowLogement(logementId:string)
{
  try{
    const logement=await prisma.logement.findUnique({
      where:{
        id:logementId
      },include:{
        logementOptions:true,
        images:true
      }
    })
    if(!logement) return
    return logement

  }catch(e){
    console.error(e)
  }
}
export async function updateLogement(
  id: string,
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

    const logement = await prisma.logement.findUnique({ where: { id } });
    if (!logement) throw new Error("Logement non trouvé");

    const existingEmail = await prisma.logement.findFirst({
      where: { email, NOT: { id } },
    });
    if (existingEmail) return { error: "L'email est déjà utilisé" };
    await prisma.logementOptionOnLogement.deleteMany({ where: { logementId: id } });
    if (images.length > 0) {
      const oldImages = await prisma.imageLogement.findMany({ where: { logementId: id } });
      await Promise.allSettled(
        oldImages.map(async (img) => {
          try {
            await del(img.urlImage);
          } catch (err) {
            console.error("Erreur suppression blob logement :", err);
          }
        })
      );
      await prisma.imageLogement.deleteMany({ where: { logementId: id } });
      const uploadedImages = await Promise.allSettled(
        images.map(async (file) => {
          try {
            const fileBuffer = Buffer.from(await file.arrayBuffer());
            const blob = await put(file.name, fileBuffer, { access: "public" });
            return { logementId: id, urlImage: blob.url };
          } catch (err) {
            console.error("Erreur upload image logement :", err);
            return null;
          }
        })
      );

      const validImages = uploadedImages
        .filter((res) => res.status === "fulfilled" && res.value !== null)
        .map((res) => (res as PromiseFulfilledResult<{ logementId: string; urlImage: string }>).value);

      if (validImages.length > 0) {
        await prisma.imageLogement.createMany({ data: validImages });
      }
    }

    await prisma.logement.update({
      where: { id },
      data: {
        nom,
        description,
        adresse,
        ville,
        telephone,
        email,
        parking,
        capacity,
        hasClim,
        hasKitchen,
        hasTV,
        hasWifi,
        surface,
        extraBed,
        nbChambres,
        price,
      },
    });

    if (option.length > 0) {
      await prisma.logementOptionOnLogement.createMany({
        data: option.map((optionId) => ({ logementId: id, optionId })),
      });
    }

    return { success: true, message: "Appartement mis à jour avec succès" };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du logement :", error);
    throw new Error(
      error instanceof Error ? error.message : "Une erreur inconnue est survenue"
    );
  }
}
export async function getUsersWithLogement(logementId:string) {
  try {
      const hotel=await prisma.userRoleAppartement.findMany({
          where:{
              logementId:logementId
          },
          include:{
              user:true,
              role:true
          }
      })
      if(!hotel) return
      return hotel
  } catch (error) {
     console.log(error) 
  }
}
export async function UpdateStatusUserLogement(logementId:string,userLogementId:string) {
  try {
    const userRole = await prisma.userRoleAppartement.findUnique({
        where: { id: userLogementId }, 
    });
    
    console.log(userRole);
    if (!userRole || userRole.logementId !== logementId) {
        console.error("userRoleAppartement not found or hotelId mismatch");
        return;
    }

    const update = await prisma.userRoleAppartement.update({
        where: { id: userLogementId },
        data: { active: !userRole.active }, 
    });

    console.log("User status updated:", update);
    return update;
} catch (error) {
    console.log(error);
}
}