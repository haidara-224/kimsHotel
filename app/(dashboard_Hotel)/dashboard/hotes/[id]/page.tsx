'use client'

import { ReservationDasbordHotel, ReservationDasbordLogement, UpdateStatusReservation } from "@/app/(action)/reservation.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { useSession } from "@/src/lib/auth-client";
import { Reservation } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function Page() {
    const { data: session, } = useSession();
    const [reservationHotel, setReservationHotel] = useState<Reservation[]>([])
    const [reservationAppartement, setReservationAppartement] = useState<Reservation[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const fetchData = async () => {
        const data = await ReservationDasbordHotel()
        setReservationHotel(data as unknown as Reservation[])
    }
    const fetchDataAppartement = async () => {
        const data = await ReservationDasbordLogement()
        setReservationAppartement(data as unknown as Reservation[])
    }
    useEffect(() => {
        fetchData()
        fetchDataAppartement()
    }, [])

    const handleConfirm = async (reservationId: string,email:string,hotelId:string) => {

        try {
            setLoading(true);
            const updateStatus = await UpdateStatusReservation(reservationId, 'CONFIRMED');
            if (!updateStatus) {
                throw new Error("Failed to update reservation status");
            } else {
                const response = await fetch(`/api/hotel/confirmReservation`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, hotelId }),
                });

                if (!response.ok) {
                    throw new Error("Failed to confirm reservation");
                }

                const data = await response.json();
                console.log(data.message);
                toast.success("Reservation confirmée avec succès !");
                fetchData(); // Refresh the reservation list after confirmation
            }

        } catch (error) {
            console.error("Error confirming reservation:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = async (reservationId: string,email:string,hotelId:string ) => {
        try {
            const updateStatus = await UpdateStatusReservation(reservationId, 'CANCELLED');
            if (!updateStatus) {
                throw new Error("Failed to update reservation status");
            }
            if(updateStatus) {
                 const response = await fetch(`/api/hotel/cancelReservation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email,hotelId }),
            });

            if (!response.ok) {
                throw new Error("Failed to cancel reservation");
            }

            const data = await response.json();
            console.log(data.message);
            fetchData(); // Refresh the reservation list after cancellation
            toast.success("Reservation annulée avec succès !");
                
            }
           
        } catch (error) {
            console.error("Error canceling reservation:", error);
        }
    };
    return (
        <>
            <section className=" px-6 py-8">


                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={session?.user.image ?? undefined} alt={session?.user.name || "User"} />
                        <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-xl text-gray-800 dark:text-white">
                        {session?.user.name}
                    </span>
                </div>
                {
                    reservationHotel.length <= 0 ? (
                        <p>Pas de reservation pour le moment</p>
                    ) : (
                        <div>
                            <Table className="min-w-full">
                                <TableCaption>Liste des Logements </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hotel</TableHead>

                                        <TableHead className="hidden lg:table-cell">Chambre</TableHead>
                                        <TableHead className="hidden lg:table-cell">Client Nom</TableHead>
                                        <TableHead className="hidden lg:table-cell">Client Email</TableHead>
                                        <TableHead className="hidden lg:table-cell">Date Arrivé</TableHead>
                                        <TableHead className="hidden lg:table-cell">Date de Départ</TableHead>
                                        <TableHead className="hidden lg:table-cell">Nombre de Personne</TableHead>

                                        <TableHead className="hidden lg:table-cell">Montant</TableHead>
                                        <TableHead className="hidden lg:table-cell">Transaction Reference</TableHead>
                                        <TableHead className="hidden lg:table-cell">Statut</TableHead>

                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reservationHotel.map((res) => (
                                        <TableRow key={res.id}>
                                            <TableCell>{res.chambre.hotel.nom}</TableCell>
                                            <TableCell>{res.chambre.numero_chambre}</TableCell>
                                            <TableCell>{res.user.name}</TableCell>
                                            <TableCell>{res.user.email}</TableCell>
                                            <TableCell>
                                                <div>{new Date(res.startDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div>{new Date(res.endDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}</div>
                                            </TableCell>

                                            <TableCell>{res.nbpersonne}</TableCell>
                                            <TableCell>{res.paiement?.montant.toLocaleString()} GNF</TableCell>
                                            <TableCell>{res.paiement?.transaction_reference}</TableCell>
                                            {
                                                res.status === 'CONFIRMED' ? (
                                                    <TableCell className="text-green-600">Payé</TableCell>
                                                ) : res.status === 'PENDING' ? (
                                                    <TableCell className="text-yellow-600">En attente de confirmation</TableCell>
                                                ) : (
                                                    <TableCell className="text-red-600">Échoué</TableCell>
                                                )
                                            }

                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Button onClick={() => handleConfirm(res.id,res.user.email,res.chambre.hotel.id)} variant="outline" className="text-blue-600 hover:text-blue-800 transition-colors">
                                                        {loading ? "Confirmation..." : "Confirmer"}
                                                    </Button>
                                                    <Button onClick={() => handleCancel(res.id,res.user.email,res.chambre.hotel.id)} variant="outline" className="text-yellow-600 hover:text-yellow-800 transition-colors">
                                                        {loading ? "Annulation..." : "Annuler"}
                                                    </Button>
                                                </div>
                                            </TableCell>




                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )
                }

                {
                    reservationAppartement.length <= 0 ? (
                        <p>Pas de reservation pour le moment Pour vos Hotel ou aucun hotel disponible</p>
                    ) : (
                        <div>
                            <Table className="min-w-full">
                                <TableCaption>Liste des Reservation De vos Appartement </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Appartement</TableHead>

                                        
                                        <TableHead className="hidden lg:table-cell">Client Nom</TableHead>
                                        <TableHead className="hidden lg:table-cell">Client Email</TableHead>
                                        <TableHead className="hidden lg:table-cell">Date Arrivé</TableHead>
                                        <TableHead className="hidden lg:table-cell">Date de Départ</TableHead>
                                        <TableHead className="hidden lg:table-cell">Nombre de Personne</TableHead>

                                        <TableHead className="hidden lg:table-cell">Montant</TableHead>
                                        <TableHead className="hidden lg:table-cell">Transaction Reference</TableHead>
                                        <TableHead className="hidden lg:table-cell">Statut</TableHead>

                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reservationAppartement.map((res) => (
                                        <TableRow key={res.id}>
                                            <TableCell>{res.logement.nom}</TableCell>
                                          
                                            <TableCell>{res.user.name}</TableCell>
                                            <TableCell>{res.user.email}</TableCell>
                                            <TableCell>
                                                <div>{new Date(res.startDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div>{new Date(res.endDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}</div>
                                            </TableCell>

                                            <TableCell>{res.nbpersonne}</TableCell>
                                            <TableCell>{res.paiement?.montant.toLocaleString()} GNF</TableCell>
                                            <TableCell>{res.paiement?.transaction_reference}</TableCell>
                                            {
                                                res.status === 'CONFIRMED' ? (
                                                    <TableCell className="text-green-600">Payé</TableCell>
                                                ) : res.status === 'PENDING' ? (
                                                    <TableCell className="text-yellow-600">En attente de confirmation</TableCell>
                                                ) : (
                                                    <TableCell className="text-red-600">Échoué</TableCell>
                                                )
                                            }

                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                  
                                                </div>
                                            </TableCell>




                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )
                }
            </section>
        </>

    );
}
