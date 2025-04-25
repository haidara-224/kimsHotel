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
export async function getRolesUserHotelId(hotelId: string) {
    try {
      const user = await currentUser();
      if (!user) throw new Error("Utilisateur non authentifié");
  
      const role = await prisma.userRoleHotel.findFirst({
        where: {
          hotelId,
          userId: user.id,
        },
        select: {
          role: true, 
        },
      });
  
      return role; 
    } catch (error) {
      console.error("Erreur dans getRolesUserHotelId :", error);
      throw new Error("Impossible de récupérer le rôle de l'utilisateur pour cet hôtel.");
    }
  }
  export async function getRolesUserLogementId(logementId: string) {
    try {
      const user = await currentUser();
      if (!user) throw new Error("Utilisateur non authentifié");
  
      const role = await prisma.userRoleAppartement.findFirst({
        where: {
          logementId,
          userId: user.id,
        },
        select: {
          role: true, 
        },
      });
  
      return role; 
    } catch (error) {
      console.error("Erreur dans getRolesUserHotelId :", error);
      throw new Error("Impossible de récupérer le rôle de l'utilisateur pour cet hôtel.");
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