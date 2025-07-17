'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import { Button } from '../button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
    AddFavorisHotelWithUser,
    AddFavorisLogementWithUser,
    isFavoriteHotelUser,
    isFavoriteLogementUser,
} from '@/app/(action)/favoris.action';
import { toast } from 'sonner';
import { useSession } from '@/src/lib/auth-client';

interface getPropsHome {
    nom: string;
    type: string;
    adresse: string;
    prix?: number;
    urlImage: string[];
    logementId?: string;
    hotelId?: string;
    rating: number; // Assurez-vous que cette prop est bien passée depuis le parent
}

export default function ListingCardHome({
    nom,
    type,
    adresse,
    urlImage,
    prix,
    logementId,
    hotelId,
    rating = 0, // Valeur par défaut si non fournie
}: getPropsHome) {
    const router = useRouter();
    const { data: session } = useSession();
    const [adding, setAdding] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const paginate = (dir: number) => {
        setDirection(dir);
        setCurrent((prev) => (prev + dir + urlImage.length) % urlImage.length);
    };

    useEffect(() => {
        const checkFavorite = async () => {
            if (!session) return;
            if (type === 'logement' && logementId) {
                setIsFavorite(await isFavoriteLogementUser(logementId));
            } else if (type === 'hotel' && hotelId) {
                setIsFavorite(await isFavoriteHotelUser(hotelId));
            }
        };
        checkFavorite();
    }, [logementId, hotelId, type, session]);

    const AddFavoris = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!session) {
            router.push('/auth/signin');
            toast.error("Veuillez vous connecter pour ajouter aux favoris");
            return;
        }
        event.preventDefault();
        setAdding(true);

        try {
            let response: { message: string; success: boolean } = { message: '', success: false };
            if (type === 'logement' && logementId) {
                response = await AddFavorisLogementWithUser(logementId);
            } else if (type === 'hotel' && hotelId) {
                response = await AddFavorisHotelWithUser(hotelId);
            }

            toast(response.message);
            setIsFavorite(!isFavorite);
            console.log("Favoris mis à jour:", response.message);
        } catch (error) {
            console.error("Erreur AddFavoris:", error);
            toast.error((error as Error).message || "Erreur lors de la modification des favoris");
        } finally {
            setAdding(false);
        }
    };

    // Fonction pour afficher les étoiles de notation
    const renderRatingStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
            } else {
                stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
            }
        }

        return (
            <div className="flex items-center mt-2">
                <div className="flex mr-1">{stars}</div>
                {rating > 0 && <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>}
            </div>
        );
    };

    return (
        <div className="overflow-hidden rounded-lg border dark:border-slate-700 shadow-md">
            <div className="relative h-72 w-full bg-black/10 overflow-hidden group">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={urlImage[current]}
                        custom={direction}
                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction < 0 ? 100 : -100 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={urlImage[current]}
                            alt={`Image ${current + 1}`}
                            fill
                            priority
                            onClick={() =>
                                router.push(
                                    type === 'logement'
                                        ? `/views/appartement/${logementId}`
                                        : `/views/hotel/${hotelId}`
                                )
                            }
                            className="object-cover w-full h-full cursor-pointer transition-transform duration-200 hover:scale-105"
                        />
                    </motion.div>
                </AnimatePresence>

                {urlImage.length > 1 && (
                    <>
                        <button
                            onClick={() => paginate(-1)}
                            className="hidden group-hover:block absolute left-3 top-1/2 -translate-y-1/2 text-2xl bg-black/50 text-white p-2 rounded-full z-10"
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            onClick={() => paginate(1)}
                            className="hidden group-hover:block absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
                        >
                            <ChevronRight />
                        </button>
                    </>
                )}

                <div className="absolute top-3 left-3 z-10">
                    <Button onClick={AddFavoris} className="dark:bg-slate-900">
                        {adding ? (
                            <div className="loaderFavoris" />
                        ) : (
                            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-700' : 'text-white'}`} />
                        )}
                    </Button>
                </div>
            </div>

            <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between">
                    <h1 className="text-sm font-semibold text-gray-900 dark:text-white">{nom}</h1>
                    <span className="text-xs text-gray-500 dark:text-white">{type}</span>
                </div>

                <p className="text-sm text-gray-500 dark:text-white">{adresse}</p>
                
                {/* Affichage du rating */}
                {renderRatingStars()}
                
                {prix && (
                    <p className="text-sm text-gray-500 mt-1">
                        {new Intl.NumberFormat('fr-FR').format(prix)} GNF / nuit
                    </p>
                )}

                <Button className="w-full mt-4">
                    <Link
                        href={
                            type === 'logement'
                                ? `/views/appartement/${logementId}`
                                : `/views/hotel/${hotelId}`
                        }
                        className="text-white dark:text-blue-800"
                    >
                        {type === 'logement' ? 'Reserver' : 'Voir Chambres'}
                    </Link>
                </Button>
            </div>
        </div>
    );
}