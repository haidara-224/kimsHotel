'use server';
import { prisma } from "@/src/lib/prisma";
import { Hotel } from "@/types/types";

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



