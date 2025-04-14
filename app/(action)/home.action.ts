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
  
  export async function getData({ searchParams }: { searchParams?: { filter?: string } }) {
 
    //await new Promise(resolve => setTimeout(resolve, 5000));
  
    const [hotels, logements] = await Promise.all([
      prisma.hotelOptionOnHotel.findMany({
        where: { option: { name: searchParams?.filter } },
        include: {
          hotel: {
            include: {
              hotelOptions: { include: { option: true } },
              categoryLogement: true,
              images: true,
  
  
            }
          }
        },
        distinct: ['hotelId'],
      }),
      prisma.logementOptionOnLogement.findMany({
        where: { option: { name: searchParams?.filter } },
        include: {
          logement: {
            include: {
              logementOptions: { include: { option: true } },
              categoryLogement: true,
              images: true
  
  
            }
          }
        },
        distinct: ['logementId'],
      }),
    ]);
  
    return [
      ...hotels.map(h => ({ type: "hotel", ...h.hotel })),
      ...logements.map(l => ({ type: "logement", ...l.logement })),
    ];
  }

