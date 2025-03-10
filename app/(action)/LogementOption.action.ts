"use server"

import { prisma } from "@/src/lib/prisma"

export async function getLogementOptions() {
    try{
    const LogementOptions= await prisma.option.findMany()
   return LogementOptions

    }catch(e){
        console.error(e)
    }
    
}
