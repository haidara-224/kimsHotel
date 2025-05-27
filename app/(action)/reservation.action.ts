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

        if (!data) return [];

        return data;

    } catch (error) {
        console.error(error);
        return [];
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
        const totalReservations = await prisma.reservation.count();
        const countLogements = await prisma.reservation.count({
            where: {
                logement: {
                    isNot: null,
                },
            },
        });
        const countChambres = await prisma.reservation.count({
            where: {
                chambre: {
                    isNot: null,
                },
            },
        });
        const logementPercentage = totalReservations > 0 ? (countLogements / totalReservations) * 100 : 0;
        const chambrePercentage = totalReservations > 0 ? (countChambres / totalReservations) * 100 : 0;
        return {
            total: totalReservations,
            logements: countLogements,
            chambres: countChambres,
            logementPercentage: logementPercentage.toFixed(2),
            chambrePercentage: chambrePercentage.toFixed(2),
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

        return reservation
    } catch (error) {
        console.error(error)
    }
}
import { revalidatePath } from "next/cache";

export async function validerReservation(data: {
    logementId: string;
    userId: string;
    price: string;
    dateA: string;
    dateD: string;
    voyageurs: string;
   
    transactionReference: string;
}) {
    try {
        const startDate = new Date(data.dateA);
        const endDate = new Date(data.dateD);
        const nbPersonne = parseInt(data.voyageurs);
        if (isNaN(nbPersonne)) {
            throw new Error("Nombre de voyageurs invalide");
        }
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error("Dates invalides");
        }

        // Valider le nombre de voyageurs


        const reservation = await prisma.reservation.create({
            data: {
                logementId: data.logementId,
                userId: data.userId,
                status: "PENDING",
                startDate,
                endDate,
                nbpersonne: nbPersonne.toString(),
            },
        });

        if (reservation) {
            await prisma.paiement.create({
                data: {
                    reservationId: reservation.id,
                    montant: parseFloat(data.price),
                   
                    transaction_reference: data.transactionReference,
                },
            });
            await prisma.logement.update({
                where: { id: data.logementId },
                data: {
                   disponible: false, 
                },
            });

        }

        revalidatePath("/");
    } catch (error) {
        console.error("Erreur:", error);
        console.error("Données de la réservation:", data);
        throw error;
    }
}
export async function validerReservationChambre(data: {
    chambreId: string;
    userId: string;
    price: string;
    dateA: string;
    dateD: string;
    voyageurs: string;
  
    transactionReference: string;
}) {
    try {
        const startDate = new Date(data.dateA);
        const endDate = new Date(data.dateD);
        const nbPersonne = parseInt(data.voyageurs);
        if (isNaN(nbPersonne)) {
            throw new Error("Nombre de voyageurs invalide");
        }
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error("Dates invalides");
        }
        const reservation = await prisma.reservation.create({
            data: {
                chambreId: data.chambreId,
                userId: data.userId,
                status: "PENDING",
                startDate,
                endDate,
                nbpersonne: nbPersonne.toString(),
            },
        });

        if (reservation) {
            await prisma.paiement.create({
                data: {
                    reservationId: reservation.id,
                    montant: parseFloat(data.price),
                
                    transaction_reference: data.transactionReference,
                },
            });
            await prisma.chambre.update({
                where: { id: data.chambreId },
                data: {
                   disponible: false, 
                },
            });

        }

        revalidatePath("/");
    } catch (error) {
        console.error("Erreur:", error);
        console.error("Données de la réservation:", data);
        throw error;
    }
}