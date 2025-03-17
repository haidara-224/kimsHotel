import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../dialog";
import { DialogHeader } from "../dialog";
import { Hotel } from "@/types/types";

interface HotelsProps {
    hotel: Hotel;
}

const Gallery = ({ hotel }: HotelsProps) => {
    const [open, setOpen] = useState(false);

    if (!hotel || !hotel.images || hotel.images.length === 0) {
        return null; 
    }

    return (
        <div className="container mx-auto px-5 lg:px-16 mt-5">
            <h1 className="text-2xl font-bold mb-4">{hotel.description}</h1>

            {/* Grille principale : Ajustement responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-auto md:h-[300px]">
                {/* Image principale : Pleine largeur sur mobile, colonne gauche sur desktop */}
                <div className="relative w-full h-[250px] md:h-full">
                    <Image
                        src={hotel.images[0].urlImage}
                        alt="Image principale"
                        fill
                        className="object-cover rounded-lg md:rounded-l-lg"
                    />
                </div>

                {/* Grille de 4 images : Passe en colonne sur mobile */}
                <div className="grid grid-cols-2 md:grid-rows-2 gap-2 relative">
                    {hotel.images.slice(1, 5).map((img, index, array) => (
                        <div key={img.id} className="relative w-full h-[120px] md:h-[150px]">
                            <Image
                                src={img.urlImage}
                                alt={`Image secondaire ${index + 1}`}
                                fill
                                className={`object-cover ${index === 0 ? "rounded-tr-lg" : ""} ${index === 3 ? "rounded-br-lg" : ""}`}
                            />

                            {/* Bouton +X photos uniquement sur la dernière image affichée */}
                            {index === array.length - 1 && hotel.images.length > 5 && (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <button className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-semibold text-lg rounded-br-lg">
                                            +{hotel.images.length - 5} photos
                                        </button>
                                    </DialogTrigger>

                                    {/* Contenu du Dialog : affichage de toutes les photos */}
                                    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Toutes les photos</DialogTitle>
                                            <DialogDescription>
                                                Cliquez sur une image pour la voir en détail.
                                            </DialogDescription>
                                        </DialogHeader>

                                        {/* Grille de toutes les images */}
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            {hotel.images.map((img, index) => (
                                                <div key={img.id} className="relative w-full h-[180px] rounded-md overflow-hidden">
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;
