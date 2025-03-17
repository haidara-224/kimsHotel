import { Logement } from "@/types/types";
import { Bed, ParkingCircle, Tv, Utensils, Wifi } from "lucide-react";

interface LogementProps {
    logement: Logement;
}

export function LogementSpecificity({ logement }: LogementProps) {
    return (
        <>
            {logement.hasClim && (
                <p className="group flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/80 transition-all duration-300 border hover:border-primary/20 cursor-pointer">
                    <Wifi className="w-5 h-5 text-blue-500" /> Wi-Fi gratuit
                </p>
            )}
            {logement.hasTV && (
                <p className="group flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/80 transition-all duration-300 border hover:border-primary/20 cursor-pointer">
                    <Tv className="w-5 h-5 text-gray-600" /> Télévision incluse
                </p>
            )}
            {logement.hasKitchen && (
                <p className="group flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/80 transition-all duration-300 border hover:border-primary/20 cursor-pointer">
                    <Utensils className="w-5 h-5 text-green-500" /> Cuisine équipée
                </p>
            )}
            {logement.parking && (
                <p className="group flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/80 transition-all duration-300 border hover:border-primary/20 cursor-pointer">
                    <ParkingCircle className="w-5 h-5 text-yellow-500" /> Parking disponible
                </p>
            )}
            {logement.extraBed && (
                <p className="group flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/80 transition-all duration-300 border hover:border-primary/20 cursor-pointer">
                    <Bed className="w-5 h-5 text-purple-500" /> Lit supplémentaire
                </p>
            )}
        </>
    );
}
