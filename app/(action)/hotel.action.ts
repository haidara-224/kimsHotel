'use server';
import { prisma } from "@/src/lib/prisma";
import { Hotel } from "@/types/types";
import {  currentUser } from "@clerk/nextjs/server";
import {put} from '@vercel/blob'
export async function createHotel(
    categoryLogementId: string,
    numero_chambre:string,
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
    type_chambre: "SIMPLE" | "DOUBLE" | "SUITE",
    parking: boolean,
    surface: number,
    etoils:number,
    extraBed: boolean,
    price: number,
    images: File[],
    imagesHotel:File[]
) {
    try {
        const user = await currentUser();
        if (!user) throw new Error("Utilisateur non authentifié");

        if (!nom || !email || !ville || !adresse || !telephone || capacity <= 0 || price < 0) {
            throw new Error("Données invalides, veuillez vérifier les champs requis.");
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Email invalide");
        if (!/^\+?\d{8,15}$/.test(telephone)) throw new Error("Numéro de téléphone invalide");

        const existingHotel = await prisma.hotel.findFirst({ where: { chambres: { some: { numero_chambre } } }, select: { id: true } });
        if (existingHotel) return { error: "Le numero est déjà utilisé" };


        const createdHotel = await prisma.hotel.create({
            data: { userId: user.id, nom, description, adresse, ville,etoils, telephone, email, parking, categoryLogementId }
        });
        const uploadedImagesHotel = await Promise.allSettled(
            imagesHotel.map(async (file) => {
                try {
                    const fileBuffer = Buffer.from(await file.arrayBuffer());
                    const blob = await put(file.name, fileBuffer, { access: 'public' });
                    return { hotelId: createdHotel.id, urlImage: blob.url };
                } catch (err) {
                    console.error("Erreur lors de l'upload d'une image :", err);
                    return null;
                }
            })
        );

        const validImagesHotel = uploadedImagesHotel.filter(result => result.status === "fulfilled" && result.value !== null)
            .map(result => (result as PromiseFulfilledResult<{ hotelId: string; urlImage: string }>).value);

        await prisma.imageHotel.createMany({ data: validImagesHotel });
       
        if (option.length > 0) {
            await prisma.hotelOptionOnHotel.createMany({
                data: option.map((optionId) => ({ hotelId: createdHotel.id, optionId }))
            });
        }


        const chambres = await prisma.chambre.create({
            data: { numero_chambre,hotelId: createdHotel.id, price, capacity, hasWifi, hasClim, hasTV, extraBed, surface, type: type_chambre }
        });

        const uploadedImages = await Promise.allSettled(
            images.map(async (file) => {
                try {
                    const fileBuffer = Buffer.from(await file.arrayBuffer());
                    const blob = await put(file.name, fileBuffer, { access: 'public' });
                    return { chambreId: chambres.id, urlImage: blob.url };
                } catch (err) {
                    console.error("Erreur lors de l'upload d'une image :", err);
                    return null;
                }
            })
        );

        const validImages = uploadedImages.filter(result => result.status === "fulfilled" && result.value !== null)
            .map(result => (result as PromiseFulfilledResult<{ chambreId: string; urlImage: string }>).value);

        await prisma.imageChambre.createMany({ data: validImages });


        const roleHotelier = await prisma.role.findUnique({ where: { name: "HOTELIER" }, select: { id: true } });
        if (!roleHotelier) throw new Error("Le rôle 'HOTELIER' n'existe pas dans la base de données.");

        const userHasRole = await prisma.userRole.findFirst({ where: { userId: user.id, roleId: roleHotelier.id } });
        if (!userHasRole) {
            await prisma.userRole.create({ data: { userId: user.id, roleId: roleHotelier.id } });
        }

        return createdHotel;

    } catch (error) {
        console.error("Erreur lors de la création du logement :", error);
        throw new Error(error instanceof Error ? error.message : "Une erreur inconnue est survenue");
    }
}

export async function getHotel() {
    try {
        const hotel = await prisma.hotel.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
                categoryLogement: true

            },

        });


        return hotel;

    } catch (error) {
        console.error("Erreur lors de la récupération des hotels :", error);
        return null;
    }

}
export async function DeleteHotel(hotels: Hotel) {
    const hotelUnique = await prisma.hotel.findUnique({
        where: { id: hotels.id },
    });

    if (!hotelUnique) return null;
    try {
        await prisma.hotel.delete({
            where: {
                id: hotels.id
            }
        });
        return hotelUnique;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'hotel :", error);
        return null;
    }

}
export async function BlokedHotelAction(id: string) {

    const hotel = await prisma.hotel.findUnique({
        where: { id },
        select: { isBlocked: true }
    });

    if (!hotel) return null;


    const updatedHotel = await prisma.hotel.update({
        where: { id },
        data: { isBlocked: !hotel.isBlocked },
        select: { isBlocked: true }
    });




    return updatedHotel.isBlocked;
}

export async function getHotelById(id: string, calculateRate = false) {
    const hotel = await prisma.hotel.findUnique({
        where: { id },
        include: {
            user: true,
            categoryLogement: true,
            avis: true,
            favorites: true,
            chambres: {
                include: {
                    ...(calculateRate && {
                        reservations: {
                            where: { status: "CONFIRMED" },
                        },
                    }),
                },
            },

        },
    });

    if (!hotel) return null;

    if (calculateRate) {
        // Calcul du taux de réservation

        const confirmedReservationsCount = hotel.chambres.reduce(
            (acc, chambre) => acc + chambre.reservations.length,
            0
        );
        const reservationRate = hotel.chambres.length > 0 ? (confirmedReservationsCount / hotel.chambres.length) * 100 : 0;

        // Calcul du taux d'avis (par rapport au nombre d'avis dans l'ensemble du système)
        const totalAvis = await prisma.avis.count(); // Nombre total d'avis pour tous les logements
        const avisRate = totalAvis > 0 ? (hotel.avis.length / totalAvis) * 100 : 0;

        // Calcul du taux de favoris (par rapport au nombre total de favoris dans tous les logements)
        const totalFavoris = await prisma.favorite.count(); // Nombre total de favoris pour tous les logements
        const favorisRate = totalFavoris > 0 ? (hotel.favorites.length / totalFavoris) * 100 : 0;
        ;
        return { ...hotel, reservationRate, avisRate, favorisRate };
    }

    return hotel;
}

export async function RepportReservation(id: string) {
    const hotel = await prisma.hotel.findUnique({
        where: { id },
        include: {
            chambres:{
                include:{
                    reservations:{
                        select:{
                            status:true
                        }
                    }
                }
            }
           
        },
    });

    if (!hotel) return [];

    // Comptage des statuts de réservation
    const statuses: { PENDING: number; CONFIRMÉ: number; CANCELLED: number } = {
        PENDING: 0,
        CONFIRMÉ: 0,
        CANCELLED: 0,
    };
    hotel.chambres.forEach((chambre) => {
        chambre.reservations.forEach((reservation) => {
            if (reservation.status === "PENDING") statuses.PENDING++;
            if (reservation.status === "CONFIRMED") statuses.CONFIRMÉ++;
            if (reservation.status === "CANCELLED") statuses.CANCELLED++;
        });
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
export async function ReportReservationByMonth(hotelId: string) {
    // Récupère toutes les chambres appartenant à cet hôtel
    const chambres = await prisma.chambre.findMany({
        where: { hotelId: hotelId },
        select: { id: true }, // On ne récupère que l'ID des chambres
    });

    if (chambres.length === 0) {
        console.warn(`Aucune chambre trouvée pour l'hôtel avec l'ID ${hotelId}`);
        return Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            confirmed: 0,
            cancelled: 0,
        }));
    }

    // Récupère toutes les réservations associées aux chambres de l'hôtel
    const reservations = await prisma.reservation.findMany({
        where: {
            chambreId: { in: chambres.map(chambre => chambre.id) }, // Recherche pour toutes les chambres
            status: { in: ["CONFIRMED", "CANCELLED"] },
        },
        select: {
            status: true,
            createdAt: true,
        },
    });

    // Initialise un tableau avec 12 mois
    const months = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1, // Indexation 1-based pour la clarté
        confirmed: 0,
        cancelled: 0,
    }));

    // Parcours toutes les réservations et les classe par mois
    reservations.forEach((reservation) => {
        const monthIndex = new Date(reservation.createdAt).getMonth(); // 0 = janvier, 11 = décembre

        if (reservation.status === "CONFIRMED") {
            months[monthIndex].confirmed++; // Incrémente le bon mois
        } else if (reservation.status === "CANCELLED") {
            months[monthIndex].cancelled++;
        }
    });

    return months;
}
export async function getHotelsDetails(hotelId:string){
    try {
        const hotel = await prisma.hotel.findUnique({
            where: { id: hotelId },
            include: {
                user: true,
                categoryLogement: true,
                hotelOptions: {
                    select: {
                        option: true,
                    },
                },
                avis: true,
                favorites: true,
                chambres: {
                    include: {
                        reservations: {
                            include:{user:true}
                        }
                    },
                },
            },
        });
    
        if (!hotel) return null;

        return hotel;
    } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'hotel :", error);
        return null;
    }
  

 
  
}
/*
interface Props{
    searchParams:{[key:string]:string | string[]| undefined}
}
const PAGE_SIZE=2
*/
export async function getDetailsHotel(hotel:string){
    //const pagenum=searchParams.pagenum ?? 0
    try {
      const hotels=await prisma.hotel.findUnique({
        where:{id:hotel},
        include:{
            user:true,
          avis:true,
          favorites:true,
          images:true,
          hotelOptions: {
            select: {
                option: true,
            },
        },
          chambres:{
            include:{
                images:true,
                
            },
          
            
          }
        }
      })
      if(!hotels) return
      return hotels
  
      
    } catch (error) {
      console.error(error)
      throw new Error("Impossible d'afficher les détails de l'hotel")
    }
  }



