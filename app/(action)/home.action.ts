/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { prisma } from "@/src/lib/prisma"


export async function GetLastLogement() {
  try {
    const logements = await prisma.logement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: true
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
  // Cas où il n’y a pas de filtre option
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
      ...hotels.map((h) => ({ type: "hotel", ...h })),
      ...logements.map((l) => ({ type: "logement", ...l })),
    ];
  }

  // Cas avec filtre par option
  const [hotelOptionsResult, logementOptionsResult] = await Promise.all([
    prisma.hotelOptionOnHotel.findMany({
      where: {
        option: {
          name: option,
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
    }),
  ]);

  // Dédoublonnage des hôtels
  const uniqueHotels = new Map<string, any>();
  hotelOptionsResult.forEach((item) => {
    const hotel = item.hotel;
    if (hotel && !uniqueHotels.has(hotel.id)) {
      uniqueHotels.set(hotel.id, { type: "hotel", ...hotel });
    }
  });

  // Dédoublonnage des logements
  const uniqueLogements = new Map<string, any>();
  logementOptionsResult.forEach((item) => {
    const logement = item.logement;
    if (logement && !uniqueLogements.has(logement.id)) {
      uniqueLogements.set(logement.id, { type: "logement", ...logement });
    }
  });

  // Résultat combiné
  return [
    ...Array.from(uniqueHotels.values()),
    ...Array.from(uniqueLogements.values()),
  ];
}

export async function SearchHebergement(destination: string) {
  const [hotels, logements] = await Promise.all([
    prisma.hotel.findMany({
      include: {
        images: true,
        categoryLogement: true,

      },
      where: {
        adresse: {
          contains: destination,
          mode: 'insensitive',
        },
        
      },

    }),
    prisma.logement.findMany({
      include: {
        images: true,
        categoryLogement: true,

      },
      where: {
        adresse: {
          contains: destination,
          mode: 'insensitive',
        },
        reservations: {
          none: {
            status: 'PENDING',
          },
        },
      },

    }),
  ]);

  return {
    hotels,
    logements,
  };
}




