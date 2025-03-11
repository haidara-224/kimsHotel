"use client";

import { getLogementById } from "@/app/(action)/Logement.action";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { MonthlyChart } from "@/src/components/ui/Dashboard/ChartReportReservation";
import { ChartReservation } from "@/src/components/ui/Dashboard/ChartReservation";
import { DetailsLogement } from "@/src/components/ui/Dashboard/DetailsLogement";

import { DetailsCardLogement } from "@/src/components/ui/Dashboard/DetailsLogementCard";
import {  CategoryLogement, Reservation, User } from "@/types/types";

import { NotepadText, Star, Heart } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
interface Logement {
    id: string;
    userId: string;
    user: User;
    categoryLogementId: string;
    categoryLogement: CategoryLogement;
    nom: string;
    description: string;
    adresse: string;
    ville: string;
    telephone: string;
    email: string;
    parking: boolean;
    reservationRate: number;
    avisRate: number;
    favorisRate: number;
    chambres: Reservation[];
    reservations: { id: string }[];
    avis: { id: string; comment: string }[];
    favorites: { id: string; userId: string }[];
    // Définissez un type pour les favoris si nécessaire
    isBlocked: boolean;
    latitude: number;
    longitude: number;
    note: number;
    etoils?: number;  // Facultatif si disponible
    price: number;
    nbChambres: number;
    surface: number;
    extraBed: boolean;
    hasClim: boolean;
    hasKitchen: boolean;
    hasTV: boolean;
    hasWifi: boolean;
    disponible: boolean;
   
    createdAt: Date;
    updatedAt: Date;
  }
export default function Page() {
    const params = useParams();
    const logementId = Array.isArray(params.id) ? params.id[0] : params.id || "";

  

    const [calculateRate, setCalculateRate] = useState<Logement | null>(null);
  

    const fetchData = useCallback(async () => {
        if (!logementId) return;
        try {
            const data = await getLogementById(logementId, true) as unknown as Logement; 
           

            setCalculateRate(data);
        } catch (error) {
            console.error("Erreur lors du chargement du logement :", error);
        }
    }, [logementId]);
   

    useEffect(() => {
       

        fetchData();
    }, [logementId,fetchData]);

    return (
        <>
            <BackButton text="Logement" link="/dashboard/logement" />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-5">
                {
                    calculateRate && (
                        <>
                            {/* Carte du taux de réservation */}
                            <DetailsCardLogement
                                title="Taux de Réservation"
                                icon={<NotepadText className="dark:text-slate-800 text-black" size={60} />}
                                progress={calculateRate.reservationRate} 
                            >
                                <p>{calculateRate.reservations.length} réservations confirmées</p>
                            </DetailsCardLogement>

                            {/* Carte du taux d'avis */}
                            <DetailsCardLogement
                                title="Taux d'Avis"
                                icon={<Star className="dark:text-slate-800 text-black" size={60} />}
                                progress={calculateRate.avisRate} 
                            >
                                <p>{calculateRate.avis.length} avis reçus</p>
                            </DetailsCardLogement>

                            {/* Carte du taux de favoris */}
                            <DetailsCardLogement
                                title="Taux de Favoris"
                                icon={<Heart className="dark:text-slate-800 text-black" size={60} />}
                                progress={calculateRate.favorisRate} 
                            >
                                <p>{calculateRate.favorites.length} utilisateurs ont ajouté ce logement en favori</p>
                            </DetailsCardLogement>
                        </>
                 )}
            </div>
            
            <div className="w-full grid grid-cols-1  lg:grid-cols-2 gap-5 mt-10">
                <ChartReservation logementId={logementId}/>
                <MonthlyChart logementId={logementId}/>
                
            </div>
            <div className="w-full mt-10">
                <DetailsLogement logementId={logementId}/>
            </div>

        </>
    );
}
// Removed custom useCallback function

