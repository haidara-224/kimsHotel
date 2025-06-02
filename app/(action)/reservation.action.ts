'use server'

import { getUser } from "@/src/lib/auth.session";
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
                },
                paiement: true
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

export async function getUserReservationsWithHotel() {
    try {
        const user = await getUser();

        if (!user?.id) {
            throw new Error("Utilisateur non authentifié.");
        }

        const reservations = await prisma.reservation.findMany({
            where: {
                userId: user.id,
                chambreId: {
                    not: null,
                },
            },
            include: {
                chambre: {
                    include: {
                        hotel: true,
                    },
                },
                paiement: true,
            },
        });

        return reservations ?? [];
    } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
        throw new Error("Impossible d'afficher les réservations de l'utilisateur.");
    }
}
export async function getUserReservationsWithLogement() {
    try {
        const user = await getUser();

        if (!user?.id) {
            throw new Error("Utilisateur non authentifié.");
        }

        const reservations = await prisma.reservation.findMany({
            where: {
                userId: user.id,
                logementId: {
                    not: null,
                },
            },
            include: {
                logement: true,
                paiement: true,
            },
        });
        console.log(reservations)
        return reservations ?? [];

    } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
        throw new Error("Impossible d'afficher les réservations de l'utilisateur.");
    }
}
export async function ReservationDasbordHotel() {
    try {
        const user = await getUser();
        if (!user?.id) {
            throw new Error("Utilisateur non authentifié.");
        }

        const hotels = await prisma.userRoleHotel.findMany({
            where: { userId: user.id },
            include: {
                hotel: {
                    include: { chambres: true }
                }
            }
        });

        const chambreIds = hotels.flatMap(h => h.hotel.chambres.map(ch => ch.id));

        const reservations = await prisma.reservation.findMany({
            where: {
                chambreId: {
                    in: chambreIds
                }
            }, include: {
                chambre: {
                    include: {
                        hotel: true,
                    },
                },
                user:true,
                paiement: true,
            }
        });

        console.log(reservations)
        return reservations;

    } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
        throw new Error("Impossible d'afficher les réservations de l'utilisateur.");
    }
}

export async function ReservationDasbordLogement() {
    try {
        const user = await getUser();
        if (!user?.id) {
            throw new Error("Utilisateur non authentifié.");
        }

        const logements = await prisma.userRoleAppartement.findMany({
            where: { userId: user.id },
            include: {
                logement: true
            }
        });
        const logementIds = logements.map(lg => lg.logement.id);

        const reservations = await prisma.reservation.findMany({
            where: {
                chambreId: {
                    in: logementIds
                }
            }
        });

        return reservations;

    } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
        throw new Error("Impossible d'afficher les réservations de l'utilisateur.");
    }
}
export async function UpdateStatusReservation(id: string, status: "CONFIRMED" | "CANCELLED") {
    try {
        const reservation = await prisma.reservation.update({
            where: { id },
            data: { status }
        });

        if (!reservation) {
            throw new Error("Réservation non trouvée ou mise à jour échouée.");
        }

        return reservation;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de la réservation :", error);
        throw new Error("Impossible de mettre à jour le statut de la réservation.");
    }
}


