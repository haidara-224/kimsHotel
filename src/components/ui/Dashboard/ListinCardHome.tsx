'use client'
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../carousel";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { AddFavorisHotelWithUser, AddFavorisLogementWithUser, isFavoriteHotelUser, isFavoriteLogementUser } from "@/app/(action)/favoris.action";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

interface getPropsHome {
    nom: string;
    type: string;
    adresse: string;
    prix?: number;
    urlImage: string[];
    
    logementId?: string;
    hotelId?: string;
}

export default function ListinCardHome({ nom, type, adresse, urlImage, prix, logementId, hotelId }: getPropsHome) {
    const router = useRouter();
    const [adding, setAdding] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const { isSignedIn } = useUser();
    const [showButtons, setShowButtons] = useState(false);


    useEffect(() => {
        const checkFavorite = async () => {
            if (!isSignedIn) return;
            if (type === "logement" && logementId) {
                setIsFavorite(await isFavoriteLogementUser(logementId));
            } else if (type === "hotel" && hotelId) {
                setIsFavorite(await isFavoriteHotelUser(hotelId));
            }
        };
        checkFavorite();
    }, [logementId, hotelId, type, isSignedIn]);

    const AddFavoris = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!isSignedIn) {
            router.push('/sign-in');
            return;
        }
        event.preventDefault();
        setAdding(true);

        try {
            let message = "";
            let success = false;

            if (type === "logement" && logementId) {
                const response = await AddFavorisLogementWithUser(logementId);
                message = response.message;
                success = response.success;
            } else if (type === "hotel" && hotelId) {
                const response = await AddFavorisHotelWithUser(hotelId);
                message = response.message;
                success = response.success;
            }

            toast(message);
            setIsFavorite(success);

        } catch (error) {
            toast.error((error as Error).message || "Erreur lors de l'ajout aux favoris");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="overflow-hidden duration-300">
            <div
                className="relative h-72 w-full overflow-hidden"
                onMouseEnter={() => setShowButtons(true)}
                onMouseLeave={() => setShowButtons(false)}
            >
                {urlImage.length > 1 ? (
                    <Carousel className="w-full h-full">
                        <CarouselContent className="w-full h-72">
                            {urlImage.map((src, index) => (
                                <CarouselItem key={index} className="relative w-full h-72">
                                    <div className="relative w-full h-72" >


                                        <Image
                                            onClick={() => router.push(`${type=='logement'?`/views/appartement/${logementId}`:`/views/hotel/${hotelId}`}`)}
                                            alt={`Image ${index + 1}`}
                                            src={src}
                                            fill
                                            priority={index === 0}
                                            className="rounded-lg h-full object-cover transition-transform duration-200 hover:scale-105  cursor-pointer"
                                            
                                        />
                                        <div className="absolute top-3 left-3 w-full">
                                            <Button onClick={AddFavoris} className="dark:bg-slate-900">
                                                {adding ? (
                                                    <div className="loaderFavoris"></div>
                                                ) : (
                                                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-700' : 'text-white'}`} />
                                                )}
                                            </Button>


                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>


                        {showButtons && (
                            <>
                                <CarouselPrevious className="absolute hidden lg:flex left-2 top-1/2 transform -translate-y-1/2 w-10 h-10  items-center justify-center bg-black/50 text-white rounded-full transition-opacity duration-300" />
                                <CarouselNext className="absolute hidden lg:flex right-2 top-1/2 transform -translate-y-1/2 w-10 h-10  items-center justify-center bg-black/50 text-white rounded-full transition-opacity duration-300" />

                            </>
                        )}
                        <>
                            <CarouselPrevious className="absolute flex lg:hidden left-2 top-1/2 transform -translate-y-1/2 w-10 h-10  items-center justify-center bg-black/50 text-white rounded-full transition-opacity duration-300" />
                            <CarouselNext className="absolute flex lg:hidden  right-2 top-1/2 transform -translate-y-1/2 w-10 h-10  items-center justify-center bg-black/50 text-white rounded-full transition-opacity duration-300" /></>


                    </Carousel>
                ) : (
                    <div className="relative h-72 w-full">

                        <Image
                             onClick={() => router.push(`${type=='logement'?`/views/appartement/${logementId}`:`/views/hotel/${hotelId}`}`)}
                            alt="Image house"
                            src={urlImage.length > 0 ? urlImage[0] : "/imgd.jpg"}
                            fill

                            className="transition-transform duration-200 hover:scale-105 rounded-lg h-full object-cover cursor-pointer"
                           
                            quality={80}
                        />
                        <div className="absolute top-3 left-3 flex justify-between w-full">
                            <Button type="submit" onClick={AddFavoris} className="dark:bg-slate-900" disabled={adding}>
                                {adding ? (
                                    <div className="loaderFavoris"></div>
                                ) : (
                                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-700' : 'text-white'}`} />
                                )}
                            </Button>


                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-sm font-semibold text-gray-900 dark:text-white">{nom}</h1>
                    <span className="text-sm text-gray-500 dark:text-white">{type}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-white">{adresse}</p>
                {prix ? (
                    <p className="text-sm text-gray-500">{prix} GNF par nuit</p>
                ) : (
                    <Link href={`/views/hotel/${hotelId}`} className="text-blue-500 dark:text-blue-200">voir plus...</Link>
                )}
            </div>
        </div>
    );
}
