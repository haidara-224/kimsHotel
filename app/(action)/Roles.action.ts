"use server"
import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth.session";



export async function getRolesUserHotel() {
    const user=await getUser()
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
    const user=await getUser()
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
   const user=await getUser()
    try {
      
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
     const user=await getUser()
    try {
     
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
   const user=await getUser()

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