'use client'
import { countedReservation } from "@/app/(action)/reservation.action";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import CardReservations from "@/src/components/ui/Dashboard/CardReservations";
import { ReservationDataTable } from "@/src/components/ui/Dashboard/ReservationDatable";
import { Home, Hotel } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
    const [reservationData, setReservationData] = useState({
        total: 0,
        logements: 0,
        chambres: 0,
        logementPercentage: "0.00",
        chambrePercentage: "0.00",
    });

    async function fetchReservationData() {
        const data = await countedReservation();
        setReservationData(data);
    }

    useEffect(() => {
        fetchReservationData();
    }, []);

    return (
        <div>
            <BackButton text="Dashboard" link="/dashboard" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CardReservations
                    title="Nombre de Chambres Réservées"
                    icon={<Hotel size={50} className="text-black" />}
                    count={reservationData.chambres}
                    percentage={parseFloat(reservationData.chambrePercentage)}
                />
                <CardReservations
                    title="Nombre d'Appartements Réservés"
                    icon={<Home size={50} className="text-black" />}
                    count={reservationData.logements}
                    percentage={parseFloat(reservationData.logementPercentage)}
                />
            </div>

            <ReservationDataTable />
        </div>
    );
}
