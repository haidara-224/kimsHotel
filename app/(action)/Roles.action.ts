"use server"
import { prisma } from "@/src/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getRolesUserHotel() {
    const user = await currentUser();
    try {
        const roles=await prisma.userRoleHotel.findMany({
            where:{
                userId:user?.id
            },
            include:{
                role:true
            }
        })
        if (!roles) return
        return roles
    } catch (error) {
        throw new Error("Impossible d'afficher les roles des utilisateur"+ error)
    }
}
export async function getRolesUserLogement() {
    const user = await currentUser();
    try {
        const roles=await prisma.userRoleAppartement.findMany({
            where:{
                userId:user?.id
            },
            include:{
                role:true
            }
        })
        if (!roles) return
        return roles
    } catch (error) {
        throw new Error("Impossible d'afficher les roles des utilisateur"+ error)
    }
}
export async function isAdminUserHotel() {
    const user = await currentUser();
    try {
        const roles=await prisma.userRoleHotel.findMany({
            where:{
                userId:user?.id,
                role: {
                    name: 'ADMIN'
                  }
            },
            
        })
        if (!roles) return
        return roles
    } catch (error) {
        throw new Error("Impossible d'afficher les roles des utilisateur"+ error)
    }
}