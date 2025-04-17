"use server";
import { prisma } from "@/src/lib/prisma";
import { put } from "@vercel/blob";


type ApiResponse = { success: true } | { error: string };

export async function CreateChambre(
    numero_chambre: string,
    description: string,
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
                description,
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

