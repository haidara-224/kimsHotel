'use client'
import { getHotelById } from "@/app/(action)/hotel.action";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { MonthlyChart } from "@/src/components/ui/Dashboard/ChartReportReservationHotel";
import { ChartReservation } from "@/src/components/ui/Dashboard/chartReservationHotel";
import { DetailsHotel } from "@/src/components/ui/Dashboard/DetailsHotel";
import { DetailsCardLogement } from "@/src/components/ui/Dashboard/DetailsLogementCard";
import { Hotels } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { Heart, NotepadText, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
    const {user} =useUser()
    const params = useParams();
    const HotelId = Array.isArray(params.hotelId) ? params.hotelId[0] : params.hotelId || "";



    const [calculateRate, setCalculateRate] = useState<Hotels | null>(null);


    const fetchData = useCallback(async () => {
        if (!HotelId) return;
        try {
            const data = await getHotelById(HotelId, true) as unknown as Hotels;


            setCalculateRate(data);
        } catch (error) {
            console.error("Erreur lors du chargement du logement :", error);
        }
    }, [HotelId]);

    useEffect(() => {
        fetchData();
    }, [HotelId, fetchData]);
    return (

        <>
           
            <BackButton text="Tableau" link={`/dashboard/hotes/${user?.id}/hotels`} />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-5">
                {
                    calculateRate && (
                        <>
                        
                            <DetailsCardLogement
                                title="Taux de Réservation"
                                icon={<NotepadText className="dark:text-slate-800 text-black" size={60} />}
                                progress={calculateRate.reservationRate}
                            >
                                <p>
                                    {calculateRate.chambres?.reduce((acc, chambre) => acc + (chambre.reservations?.length ?? 0), 0)}
                                    réservations confirmées
                                </p>

                            </DetailsCardLogement>

                     
                            <DetailsCardLogement
                                title="Taux d'Avis"
                                icon={<Star className="dark:text-slate-800 text-black" size={60} />}
                                progress={calculateRate.avisRate}
                            >
                                <p>{calculateRate.avis.length ?? 0} avis reçus</p>
                            </DetailsCardLogement>

                            {/* Carte du taux de favoris */}
                            <DetailsCardLogement
                                title="Taux de Favoris"
                                icon={<Heart className="dark:text-slate-800 text-black" size={60} />}
                                progress={calculateRate.favorisRate}
                            >
                                <p>{calculateRate.favorites.length ?? 0} utilisateurs ont ajouté ce logement en favori</p>
                            </DetailsCardLogement>
                        </>
                    )}
            </div>

            <div className="w-full grid grid-cols-1  lg:grid-cols-2 gap-5 mt-10">

                <ChartReservation hotelId={HotelId} />
                <MonthlyChart hotelId={HotelId} />




            </div>
            <div className="w-full mt-10">
                <DetailsHotel hotelId={HotelId} />
            </div>

       
        </>
    )

}