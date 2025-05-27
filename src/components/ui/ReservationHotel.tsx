"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { CalendarDays, DollarSign, Hotel, MapPin } from "lucide-react";
import { useSession } from "@/src/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Reservation } from "@/types/types";
import { getUserReservationsWithHotel } from "@/app/(action)/reservation.action";

export default function ReservationHotel() {
    const { data: session, isPending } = useSession();
    const isUnauthenticated = !session && !isPending;
    const [reservations, setReservation] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (isUnauthenticated) {
            router.push("/auth/signin");
        }
    }, [isUnauthenticated, router]);

    const statusColor = (status: string) => {
        switch (status) {
            case "Confirmed":
                return "bg-emerald-500/10 text-emerald-600";
            case "Pending":
                return "bg-amber-500/10 text-amber-600";
            case "Cancelled":
                return "bg-rose-500/10 text-rose-600";
            default:
                return "bg-gray-500/10 text-gray-600";
        }
    };

    const reservationHotel = async () => {
        try {
            const data = await getUserReservationsWithHotel();
            setReservation(data as unknown as Reservation[]);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        reservationHotel();
    }, []);

    if (loading) {
        return (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="overflow-hidden shadow-sm">
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-4 w-1/4" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">My Reservations</h1>
            
            {reservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Hotel className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No reservations yet</h2>
                    <p className="text-gray-500 max-w-md">
                        You haven&apos;t made any reservations. Start exploring our hotels and book your perfect stay!
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {reservations.map((reservation) => (
                        <Card key={reservation.id} className="overflow-hidden transition-all hover:shadow-md">
                            <div className="relative">
                                <div className="absolute top-4 right-4 z-10">
                                    <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(reservation.status)}`}>
                                        {reservation.status}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold line-clamp-1">
                                    {reservation.chambre.hotel.nom}
                                </CardTitle>
                                <div className="text-sm text-gray-500">
                                    Room #{reservation.chambre.numero_chambre}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 mt-0.5 text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-600">
                                        {reservation.chambre.hotel.adresse}
                                    </span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CalendarDays className="w-5 h-5 mt-0.5 text-gray-400 flex-shrink-0" />
                                    <div className="text-sm text-gray-600">
                                        <div>{new Date(reservation.startDate).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}</div>
                                        <div className="text-xs text-gray-400">to</div>
                                        <div>{new Date(reservation.endDate).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 pt-2 border-t border-gray-100">
                                    <DollarSign className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {reservation.paiement?.montant.toLocaleString()} GNF
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}