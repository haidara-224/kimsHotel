"use server"

import { prisma } from "@/src/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function AddFavorisLogementWithUser(logementId: string) {
    const user = await currentUser();
    if (!user) throw new Error("Utilisateur non connecté");

  
    const alreadyFavorite = await prisma.favorite.findFirst({
        where: { userId: user.id, logementId }
    });

    if (alreadyFavorite) {
       
        await prisma.favorite.delete({
            where: { id: alreadyFavorite.id }
        });
        return { success: false, message: "Le logement a été retiré des favoris" };
    }

  
    await prisma.favorite.create({
        data: { logementId, userId: user.id }
    });
    return { success: true, message: "Le logement a été ajouté aux favoris" };
}


export async function AddFavorisHotelWithUser(hotelId: string) {
    const user = await currentUser();
    if (!user)  return { success: false, message: "Utilisateur non connecté" }
    const alreadyFavorite = await prisma.favorite.findFirst({
        where: { userId: user.id, hotelId }
    });

    if (alreadyFavorite) {
        await prisma.favorite.delete({
            where: { id: alreadyFavorite.id }
        });
        return { success: false, message: "L'hôtel a été retiré des favoris" };
    }

    await prisma.favorite.create({
        data: { hotelId, userId: user.id }
    });
    return { success: true, message: "L'hôtel a été ajouté aux favoris" };
}



export async function isFavoriteLogementUser(logementId: string) {
    const user = await currentUser();
    if (!user) return false;

    const isFavorite = await prisma.favorite.findFirst({
        where: { userId: user.id, logementId }
    });

    return !!isFavorite;
}

export async function isFavoriteHotelUser(hotelId: string) {
    const user = await currentUser();
    if (!user) return false;

    const isFavorite = await prisma.favorite.findFirst({
        where: { userId: user.id, hotelId }
    });

    return !!isFavorite;
}

  
  