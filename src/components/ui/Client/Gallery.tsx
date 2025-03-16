import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../dialog";
import { DialogHeader } from "../dialog";
import { Logement } from "@/types/types";

interface LogementsProps {
    logement: Logement;
}

const Gallery = ({ logement }: LogementsProps) => {
    const [open, setOpen] = useState(false);

    if (!logement || !logement.images || logement.images.length === 0) {
        return null; // Évite les erreurs si logement n'a pas d'images
    }

    return (
        <div className="container mx-auto px-5 lg:px-16 mt-5">
            <h1 className="text-2xl font-bold mb-4">{logement.description}</h1>

            {/* Grille principale : 2 colonnes */}
            <div className="grid grid-cols-2 gap-2 h-[300px]">
                {/* Image principale (colonne de gauche) */}
                <div className="relative w-full h-full">
                    <Image
                        src={logement.images[0].urlImage}
                        alt="Image principale"
                        fill
                        className="object-cover rounded-l-lg"
                    />
                </div>

                {/* Grille de 4 images (colonne de droite) */}
                <div className="grid grid-rows-2 gap-2">
                    {/* Première rangée de 2 images */}
                    <div className="grid grid-cols-2 gap-2">
                        {logement.images[1] && (
                            <div className="relative w-full h-[150px]">
                                <Image
                                    src={logement.images[1].urlImage}
                                    alt="Image secondaire 1"
                                    fill
                                    className="object-cover rounded-tr-lg"
                                />
                            </div>
                        )}
                        {logement.images[2] && (
                            <div className="relative w-full h-[150px]">
                                <Image
                                    src={logement.images[2].urlImage}
                                    alt="Image secondaire 2"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Deuxième rangée de 2 images */}
                    <div className="grid grid-cols-2 gap-2">
                        {logement.images[3] && (
                            <div className="relative w-full h-[150px]">
                                <Image
                                    src={logement.images[3].urlImage}
                                    alt="Image secondaire 3"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        {logement.images[4] && (
                            <div className="relative w-full h-[150px]">
                                <Image
                                    src={logement.images[4].urlImage}
                                    alt="Image secondaire 4"
                                    fill
                                    className="object-cover rounded-br-lg"
                                />

                                {/* Bouton +X photos si plus de 5 images */}
                                {logement.images.length > 5 && (
                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger asChild>
                                            <button
                                                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-semibold text-lg"
                                            >
                                                +{logement.images.length - 5} photos
                                            </button>
                                        </DialogTrigger>

                                        {/* Contenu du Dialog : affichage de toutes les photos */}
                                        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Toutes les photos</DialogTitle>
                                                <DialogDescription>
                                                    Cliquez sur une image pour la voir en détail (optionnel).
                                                </DialogDescription>
                                            </DialogHeader>

                                            {/* Grille de toutes les images */}
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                {logement.images.map((img, index) => (
                                                    <div
                                                        key={img.id}
                                                        className="relative w-full h-[180px] rounded-md overflow-hidden"
                                                    >
                                                        <Image
                                                            src={img.urlImage}
                                                            alt={`Image ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </DialogContent>

                                    </Dialog>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gallery;
