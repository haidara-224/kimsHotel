"use client";
import { NavBar } from "@/src/components/ui/NavBar";
import { Favorites } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { deleteFavorisById, getFavorisByUserId } from "../(action)/favoris.action";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Loader from "@/src/components/ui/Client/Loader";

export default function Page() {
    const { user, isSignedIn } = useUser();
    const [favoris, setFavoris] = useState<Favorites[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [hoveredFavoriId, setHoveredFavoriId] = useState<string | null>(null);

    const userId = user?.id || null;

    const fetchFavoris = useCallback(async () => {
        if (userId) {
            setIsLoading(true);
            try {
                const data = await getFavorisByUserId();

                setFavoris(data as Favorites[]);
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement des favoris.");
            } finally {
                setIsLoading(false);
            }
        }
    }, [userId]);

    const removeFavoris = async (favoriId: string) => {

        if (isLoading) return;
        if (!userId) return;

        try {
            setPending(true);
            setError(null);

            await deleteFavorisById(favoriId);
            toast("Etablissement  supprimé de vos Favoris !");
            setFavoris((prev) => prev.filter((favori) => favori.id !== favoriId));

        } catch (err) {
            setPending(false);

            console.error(err);
            setError("Erreur lors de la suppression du favori.");
        } finally {
            setPending(false);
        }
    };

    useEffect(() => {

        fetchFavoris();

    }, [isSignedIn, router, fetchFavoris]);

    if (isLoading) {
        return (
            <>
                <div className="w-full min-h-screen bg-background">
                    <nav className="bg-white shadow-md  z-40 p-2 lg:p-5">
                        <NavBar />
                    </nav>
                    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50">
                        <Loader />
                    </div>
                </div>
            </>

        )
    }

    if (error) {
        return <div className="text-red-500 text-center mt-5">{error}</div>;
    }

    if (!favoris || favoris.length === 0) {
        return (
            <>
                <div className="w-full min-h-screen bg-background">
                    <nav className="bg-white shadow-md  z-40 p-2 lg:p-5">
                        <NavBar />

                    </nav>
                    <div className="text-center mt-5">Aucun favori trouvé.</div>
                </div>

            </>
        )

    }

    return (
        <>
            <div className="w-full min-h-screen bg-background">
                <nav className="bg-white shadow-md  z-40 p-2 lg:p-5">
                    <NavBar />
                </nav>
                <div className="py-16 px-1 md:px-8 max-w-7xl mx-auto ">
                    <h1 className="text-2xl font-bold mb-5">Favoris</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 relative ">
                        {favoris.map((favori) => (
                            <div
                                key={favori.id}
                                className="rounded-lg relative"
                                onMouseEnter={() => setHoveredFavoriId(favori.id)}
                                onMouseLeave={() => setHoveredFavoriId(null)}
                            >
                                <div className="grid grid-cols-2 gap-1 h-auto rounded-lg overflow-hidden">
                                    {favori.logement?.images?.slice(0, 4).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.urlImage || "/placeholder.jpg"}
                                            alt={`Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )) ||
                                        favori.hotel?.images?.slice(0, 4).map((image, index) => (
                                            <img
                                                key={index}
                                                src={image.urlImage || "/placeholder.jpg"}
                                                alt={`Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ))}
                                </div>

                                <div className="flex justify-between">
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold">
                                            {favori.logement ? favori.logement.nom : favori.hotel?.nom}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Ajouté le {new Date(favori.createdAt).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>

                                    <Link
                                        href={favori.logement ? `/views/appartement/${favori.logement.id}` : `/views/hotel/${favori.hotel?.id}`}

                                        aria-label="Voir le favori"
                                        className="text-2xl text-blue-700"
                                    >
                                        voir
                                    </Link>


                                    <div>
                                        {
                                            hoveredFavoriId === favori.id && (
                                                <button
                                                    className="text-slate-900 bg-white rounded-full p-1 m-2 mt-5 absolute top-0 right-0"
                                                    onMouseEnter={() => setHoveredFavoriId(favori.id)}
                                                    onMouseLeave={() => setHoveredFavoriId(null)}
                                                    disabled={pending}
                                                    type="button"
                                                    onClick={() => removeFavoris(favori.id)}
                                                >
                                                    {pending ? (
                                                        <div className="w-5 h-5 border-2 border-gray-200 border-t-transparent rounded-full animate-spin mx-5" />
                                                    ) : (
                                                        <X className="w-5 h-5 text-slate-900" />
                                                    )}
                                                </button>
                                            )
                                        }

                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </>
    );
}
