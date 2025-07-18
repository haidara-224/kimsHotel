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


  const [hotelsFiltered, logementsFiltered] = await Promise.all([
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
      distinct: ['hotelId'],
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




