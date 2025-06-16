'use server'

import { prisma } from "@/src/lib/prisma"


export async function GetLastLogement() {
    try {
      const logements = await prisma.logement.findMany({
        orderBy: {
          createdAt: 'desc',  
        },
        include:{
            images:true
        },
        take: 3,  
      });
      
      return logements;
    } catch (error) {
      console.error('Error fetching logements:', error);
      throw new Error('Failed to fetch logements');
    }
  }


export async function getData(option?: string) {
  // 🔹 CAS 1 : aucun filtre => on retourne tout
  if (!option) {
    const [hotels, logements] = await Promise.all([
      prisma.hotel.findMany({
        include: {
          images: true,
          categoryLogement: true,
          hotelOptions: { include: { option: true } },
        },
      }),
      prisma.logement.findMany({
        include: {
          images: true,
          categoryLogement: true,
          logementOptions: { include: { option: true } },
        },
      }),
    ]);

    return [
      ...hotels.map(h => ({ type: "hotel", ...h })),
      ...logements.map(l => ({ type: "logement", ...l })),
    ];
  }

  // 🔹 CAS 2 : un filtre (option) est sélectionné => on filtre par option
  const [hotelsFiltered, logementsFiltered] = await Promise.all([
    prisma.hotelOptionOnHotel.findMany({
      where: {
        option: {
          name: option, // nom de l'option sélectionnée (ex: "wifi", "piscine", etc.)
        },
      },
      include: {
        hotel: {
          include: {
            images: true,
            categoryLogement: true,
            hotelOptions: { include: { option: true } },
          },
        },
      },
      distinct: ['hotelId'], // Pour éviter les doublons
    }),

    prisma.logementOptionOnLogement.findMany({
      where: {
        option: {
          name: option,
        },
      },
      include: {
        logement: {
          include: {
            images: true,
            categoryLogement: true,
            logementOptions: { include: { option: true } },
          },
        },
      },
      distinct: ['logementId'],
    }),
  ]);

  return [
    ...hotelsFiltered.map(h => ({
      type: "hotel",
      ...h.hotel,
    })),
    ...logementsFiltered.map(l => ({
      type: "logement",
      ...l.logement,
    })),
  ];
}

 

