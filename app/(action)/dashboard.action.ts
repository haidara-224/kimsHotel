"use server"
import { prisma } from "@/src/lib/prisma";
import { format } from "date-fns";
import {fr} from "date-fns/locale/fr";

export async function getCountLogement() {
    const countLogement=await prisma.logement.count();
    return countLogement
}
export async function getCountHotel() {
  const countHotel=await prisma.hotel.count();
  return countHotel
}
export async function getCountReservaTion() {
    const countReservation=await prisma.reservation.count()
    return countReservation
    
}
export async function getCountUser() {
    const countUser=await prisma.user.count()
  
    return countUser
    
}
export async function getCountAvisEval() {
    const countAvis=await prisma.avis.count()
    return countAvis
    
}


export async function getReservationsPerMonth() {
  const reservations = await prisma.reservation.groupBy({
    by: ["createdAt"],
    _count: {
      _all: true,
    },
  });

  // Formatter les données pour le graphique
  const formattedData = reservations.map((r) => ({
    month: format(new Date(r.createdAt), "MMM", { locale: fr }), // Convertir en mois (ex: "Jan", "Fév")
    reservations: r._count._all, // Nombre total de réservations
  }));

  return formattedData;
}