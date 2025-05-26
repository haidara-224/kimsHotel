"use server";
import { prisma } from "@/src/lib/prisma";

import { getUser } from "@/src/lib/auth.session";


export async function createAvis(hotelId: string, rating: number) {
     const user=await getUser()
   
    if (!user) {
        return { success: false, message: "Utilisateur non connecté" };
    }

    if (!hotelId || typeof rating !== "number" || rating < 1) {
        return { success: false, message: "Données manquantes ou invalides" };
    }

    try {

        const existingAvis = await prisma.avis.findFirst({
            where: {
                userId: user.id,
                hotelId: hotelId,
            }
        });

        if (existingAvis) {

            const updatedRating = await prisma.avis.update({
                where: { id: existingAvis.id },
                data: { start: rating },
            });

            return { success: true, avis: updatedRating };
        }


        const avis = await prisma.avis.create({
            data: {
                hotelId,
                userId: user.id,
                start: rating,
            },
        });

        return { success: true, avis };
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'avis :", error);
        return { success: false, message: "Erreur serveur" };
    }
}

export async function createComment(hotelId: string, comment: string) {
const user=await getUser()
    if (!user) {
        return { success: false, message: "Utilisateur non connecté" };
    }

    if (!hotelId || !comment.trim()) {
        return { success: false, message: "Données manquantes" };
    }

    try {
        const commentaire = await prisma.commentaireHotel.create({
            data: {
                comment,
                hotelId,
                userId: user.id,
            },
        });
        return { success: true, commentaire };
    } catch (error) {
        console.error("Erreur lors de l'envoi du commentaire :", error);
        return { success: false, message: "Erreur serveur" };
    }
}
export async function getAvisByUser(hotelId: string) {
 const user=await getUser()
    if (!user) return null;

    return await prisma.avis.findFirst({
        where: {
            userId: user.id,
            hotelId: hotelId
        }
    });
}
export async function UserCommentHotel(hotelId: string) {
    const comments = await prisma.commentaireHotel.findMany({
        where: {
            hotelId: hotelId, 
        },
        include: {
            user: {
                select: {
                    id:true,
                    name: true,
                    image: true,
                    avis: {
                        where: {
                            hotelId: hotelId, 
                        },
                        select: {
                            start: true,  
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
       
    });

    return comments;
}
export async function DeleteCommentUser(commentId: string) {
    try {
        const deleteMessage=await prisma.commentaireHotel.delete({
            where:{
                id:commentId
            }
        })
        return deleteMessage

    } catch (error) {
        console.log(error)
    }
}