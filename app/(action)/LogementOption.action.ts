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
export async function getLogementOptionIdName(){
    try{
        const LogementOptions=await prisma.option.findMany({
            select:{
                id: true,
                title: true,
                imageUrl:true
            }
        })
        if(LogementOptions.length<0) return
        return LogementOptions

    }catch(error){
        console.log(error)
    }
}
