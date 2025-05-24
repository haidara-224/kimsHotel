"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth.session";



export async function createAvis(logementId: string, rating: number) {
 const user=await getUser()
    if (!user) {
        return { success: false, message: "Utilisateur non connecté" };
    }

    if (!logementId || typeof rating !== "number" || rating < 1) {
        return { success: false, message: "Données manquantes ou invalides" };
    }

    try {

        const existingAvis = await prisma.avis.findFirst({
            where: {
                userId: user.id,
                logementId: logementId,
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
                logementId,
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


export async function createComment(logementId: string, comment: string) {
  const user=await getUser()
    if (!user) {
        return { success: false, message: "Utilisateur non connecté" };
    }

    if (!logementId || !comment.trim()) {
        return { success: false, message: "Données manquantes" };
    }

    try {
        const commentaire = await prisma.commentaireLogement.create({
            data: {
                comment,
                logementId,
                userId: user.id,
            },
        });
        return { success: true, commentaire };
    } catch (error) {
        console.error("Erreur lors de l'envoi du commentaire :", error);
        return { success: false, message: "Erreur serveur" };
    }
}
export async function getAvisByUser(logementId: string) {
 const user=await getUser()
    if (!user) return null;

    return await prisma.avis.findFirst({
        where: {
            userId: user.id,
            logementId: logementId
        }
    });
}
export async function UserComment(logementId: string) {
    const comments = await prisma.commentaireLogement.findMany({
        where: {
            logementId: logementId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                 
                    profileImage: true,
                    avis: {
                        where: {
                            logementId: logementId,
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
        const deleteMessage=await prisma.commentaireLogement.delete({
            where:{
                id:commentId
            }
        })
        return deleteMessage

    } catch (error) {
        console.log(error)
    }
}





