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
        return null;
    }

    return (
        <>

            <h1 className="text-2xl font-bold mb-4">{logement.description}</h1>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-auto md:h-[300px]">

                <div className="relative w-full h-[250px] md:h-full">
                    <Image
                        src={logement.images[0].urlImage}
                        alt="Image principale"
                        fill
                        className="object-cover rounded-lg md:rounded-l-lg"
                    />
                </div>


                <div className="grid grid-cols-2 md:grid-rows-2 gap-2 relative">
                    {logement.images.slice(1, 5).map((img, index, array) => (
                        <div key={img.id} className="relative w-full h-[120px] md:h-[150px]">
                            <Image
                                src={img.urlImage}
                                alt={`Image secondaire ${index + 1}`}
                                fill
                                className={`object-cover ${index === 0 ? "rounded-tr-lg" : ""} ${index === 3 ? "rounded-br-lg" : ""}`}
                            />

                            {index === array.length - 1 && logement.images.length > 5 && (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <button className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-semibold text-lg rounded-br-lg">
                                            +{logement.images.length - 5} photos
                                        </button>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Toutes les photos</DialogTitle>
                                            <DialogDescription>
                                             Photos du Logements
                                            </DialogDescription>
                                        </DialogHeader>


                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            {logement.images.map((img, index) => (
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
        </>
    );
};

export default Gallery;
