'use server'

import { prisma } from "@/src/lib/prisma"

export async function getReservation() {
    try {
        const data = await prisma.reservation.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: true,
                logement: true,
                chambre: {
                    include: {
                        hotel: true
                    }
                }
            }
        });
        
        // Si aucune donnée n'est trouvée, retourne un tableau vide pour éviter des erreurs dans le rendu
        if (!data) return [];

        return data;

    } catch (error) {
        console.error(error);
        return []; // En cas d'erreur, retourne un tableau vide pour éviter des problèmes de rendu
    }
}

export async function deleteReservation(id: string) {
    try {
        const reservation = await prisma.reservation.findUnique({
            where: {
                id
            }
        })
        if (!reservation) return
        const deleted = await prisma.reservation.delete({
            where: {
                id
            }
        })
        if (!deleted) {
            throw new Error("Can't delete this reservation, because fuck you");

        }
        return deleted
    } catch (error) {
        console.error(error)
    }

}
export async function countedReservation() {
    try {
        // Nombre total de réservations
        const totalReservations = await prisma.reservation.count();

        // Nombre de logements distincts réservés
        const countLogements = await prisma.reservation.count({
            where: {
                logement: {
                    isNot: null, // Vérifie qu'un logement est bien associé
                },
            },
        });

        // Nombre de chambres distinctes réservées
        const countChambres = await prisma.reservation.count({
            where: {
                chambre: {
                    isNot: null, // Vérifie qu'une chambre est bien associée
                },
            },
        });

        // Calcul des pourcentages
        const logementPercentage = totalReservations > 0 ? (countLogements / totalReservations) * 100 : 0;
        const chambrePercentage = totalReservations > 0 ? (countChambres / totalReservations) * 100 : 0;
        return {
            total: totalReservations,
            logements: countLogements,
            chambres: countChambres,
            logementPercentage: logementPercentage.toFixed(2), // Arrondi à 2 décimales
            chambrePercentage: chambrePercentage.toFixed(2), // Arrondi à 2 décimales
        };
    } catch (error) {
        console.error("Erreur lors du comptage des réservations :", error);
        return {
            total: 0,
            logements: 0,
            chambres: 0,
            logementPercentage: "0.00",
            chambrePercentage: "0.00",
        };
    }
}


export async function getReservationById(id: string) {
    try {
        const reservation = await prisma.reservation.findUnique({
            where: {
                id
            },
            include:{
                user: true,
                logement: true,
                chambre: {
                    include: {
                        hotel: true
                    }
                }
            }
        })
 
        return reservation
    } catch (error) {
        console.error(error)
    }
}