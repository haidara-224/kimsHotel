'use server'

import { prisma } from "@/src/lib/prisma"

export async function getOptons() {
    try {
       return await prisma.option.findMany()
     
    } catch (error) {
        throw new Error('Impossible de recupere les options'+ error)
    }
}