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
  