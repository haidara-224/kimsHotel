"use server";
import { prisma } from "@/src/lib/prisma";

import { put,del } from "@vercel/blob";


type ApiResponse = { success: true } | { error: string };

export async function CreateChambre(
    numero_chambre: string,
 
    hotelId: string,
    capacity: number,
    hasClim: boolean,
    hasWifi: boolean,
    hasTV: boolean,
    type_chambre: "SIMPLE" | "DOUBLE" | "SUITE",
    surface: number,
    extraBed: boolean,
    price: number,
    images: File[],
): Promise<ApiResponse> {
    try {
        const existingChambre = await prisma.chambre.findUnique({
            where: { numero_chambre },
        });

        if (existingChambre) {
            return { error: "Une chambre avec ce numéro existe déjà." };
        }

        const chambre = await prisma.chambre.create({
            data: {
                numero_chambre,
                hotelId,
                capacity,
                hasClim,
                hasWifi,
                hasTV,
                type: type_chambre,
                surface,
                extraBed,
                price,
            },
        });

        if (chambre && images.length > 0) {
            const uploadedImages = await Promise.allSettled(
                images.map(async (file) => {
                    try {
                        const fileBuffer = Buffer.from(await file.arrayBuffer());
                        const blob = await put(file.name, fileBuffer, { access: 'public' });
                        return { chambreId: chambre.id, urlImage: blob.url };
                    } catch (err) {
                        console.error("Erreur lors de l'upload d'une image :", err);
                        return null;
                    }
                })
            );

            const validImages = uploadedImages
                .filter(result => result.status === "fulfilled" && result.value !== null)
                .map(result => (result as PromiseFulfilledResult<{ chambreId: string; urlImage: string }>).value);

            if (validImages.length > 0) {
                await prisma.imageChambre.createMany({ data: validImages });
            }
        }

        return { success: true };

    } catch (error) {
        console.error("Erreur lors de la création de la chambre :", error);
        return {
            error: error instanceof Error
                ? error.message
                : "Une erreur inconnue est survenue"
        };
    }
}
export async function toggleDisponibilite(chambreId: string) {
    try {
        const chambre = await prisma.chambre.findUnique({
            where: { id: chambreId },
        });

        if (!chambre) {
            throw new Error("Chambre non trouvée");
        }

        const nouvelleDisponibilite = !chambre.disponible;

        const updatedChambre = await prisma.chambre.update({
            where: { id: chambreId },
            data: { disponible: nouvelleDisponibilite },
        });

        return updatedChambre;

    } catch (error) {
        console.error("Erreur lors du changement de disponibilité :", error);
        throw new Error(error instanceof Error ? error.message : "Une erreur inconnue est survenue");
    }
}


export async function DeleteChambre(chambreId: string) {
    try {
        const chambre = await prisma.chambre.findUnique({
            where: { id: chambreId },
            include: {
                reservations: {
                    where: { status: "CONFIRMED" }, 
                },
            },
        });

        if (!chambre) {
            throw new Error("Chambre non trouvée");
        }

        if (chambre.reservations.length > 0) {
            throw new Error("Impossible de supprimer cette chambre car elle a des réservations confirmées.");
        }

        await prisma.chambre.delete({
            where: { id: chambreId },
        });

        return { success: true, message: "Chambre supprimée avec succès." };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression.",
        };
    }
}


export async function getChambreById(id:string) {
    try {
        const chambres=await prisma.chambre.findUnique({
            where:{
                id
            }
        })
        if(!chambres) return
        return chambres
        
    } catch (error) {
        throw new Error("Impossible d'afficher les donnees "+error)
    }
}


// ⚠️ Assure-toi que t'as bien cette fonction dispo !

export async function UpdateChambre(
    id: string,
    numero_chambre: string,
    hotelId: string,
    capacity: number,
    hasClim: boolean,
    hasWifi: boolean,
    hasTV: boolean,
    type_chambre: "SIMPLE" | "DOUBLE" | "SUITE",
    surface: number,
    extraBed: boolean,
    price: number,
    images: File[]
): Promise<ApiResponse> {
    try {
        const existingChambre = await prisma.chambre.findUnique({ where: { id } });
        if (!existingChambre) return { error: "Chambre introuvable." };

        const chambreWithSameNumber = await prisma.chambre.findFirst({
            where: { numero_chambre, NOT: { id } },
        });
        if (chambreWithSameNumber) return { error: "Une autre chambre utilise déjà ce numéro." };

        await prisma.chambre.update({
            where: { id },
            data: {
                numero_chambre,
                hotelId,
                capacity,
                hasClim,
                hasWifi,
                hasTV,
                type: type_chambre,
                surface,
                extraBed,
                price,
            },
        });

        if (images.length > 0) {
            // 🔥 Étape 1 : Récupérer les anciennes images
            const oldImages = await prisma.imageChambre.findMany({ where: { chambreId: id } });

            // 🔥 Étape 2 : Supprimer les fichiers de Vercel Blob
            await Promise.allSettled(
                oldImages.map(async (img) => {
                    try {
                        await del(img.urlImage); // ça supprime le blob
                    } catch (err) {
                        console.error("Erreur lors de la suppression d'un blob :", err);
                    }
                })
            );

            // 🔥 Étape 3 : Supprimer les enregistrements en base
            await prisma.imageChambre.deleteMany({ where: { chambreId: id } });

            // 🔥 Étape 4 : Uploader les nouvelles images
            const uploadedImages = await Promise.allSettled(
                images.map(async (file) => {
                    try {
                        const fileBuffer = Buffer.from(await file.arrayBuffer());
                        const blob = await put(file.name, fileBuffer, { access: 'public' });
                        return { chambreId: id, urlImage: blob.url };
                    } catch (err) {
                        console.error("Erreur upload image :", err);
                        return null;
                    }
                })
            );

            const validImages = uploadedImages
                .filter(res => res.status === "fulfilled" && res.value !== null)
                .map(res => (res as PromiseFulfilledResult<{ chambreId: string; urlImage: string }>).value);

            if (validImages.length > 0) {
                await prisma.imageChambre.createMany({ data: validImages });
            }
        }

        return { success: true };

    } catch (error) {
        console.error("Erreur lors de la mise à jour de la chambre :", error);
        return {
            error: error instanceof Error
                ? error.message
                : "Une erreur inconnue est survenue"
        };
    }
}


