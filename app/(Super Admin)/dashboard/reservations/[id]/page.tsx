'use client'
import { getReservationById } from "@/app/(action)/reservation.action";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@/src/components/ui/table";
import { Reservation } from "@/types/types";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [reseration, setReservation] = useState<Reservation | null>(null)
    const params = useParams()
    const reservationId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";
    useEffect(() => {
        async function fetchData() {
            const data = await getReservationById(reservationId) as unknown as Reservation; 
            if (data !== undefined) {
                setReservation(data)
            }
        }
        fetchData()
    }, [reservationId])

    return (
        <>
            <BackButton text="Reservation" link="/dashboard/reservations" />
            <div className="mb-5">
                <h1>Information sur La Reservation</h1>
                <Table className="min-w-full border">

                    <TableBody>
                        <TableRow>
                            <TableHead className="font-semibold">Dedut de sejours</TableHead>
                            <TableCell>{reseration?.startDate && new Date(reseration.startDate).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead className="font-semibold">Fin de séjours</TableHead>
                            <TableCell>{reseration?.endDate && new Date(reseration.endDate).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead className="font-semibold">Statut</TableHead>
                            <TableCell>{reseration?.status}</TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
                <h1>Information sur Le Client</h1>
                <Table className="min-w-full border">

                    <TableBody>
                        <TableRow>
                            <TableHead className="font-semibold">Nom</TableHead>
                            <TableCell>{reseration?.user.nom}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead className="font-semibold">Email</TableHead>
                            <TableCell>{reseration?.user.email}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead className="font-semibold">Téléphone</TableHead>
                            <TableCell>{reseration?.user.telephone}</TableCell>
                        </TableRow>



                    </TableBody>
                </Table>
            </div>
            <div className="mb-5">
                <h1>Information sur L&apos;Etablissement</h1>
                {
                    reseration?.logement ? (

                        <Table className="min-w-full border">

                            <TableBody>
                                <TableRow>
                                    <TableHead className="font-semibold">Nom</TableHead>
                                    <TableCell>{reseration?.logement.nom}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">Adresse</TableHead>
                                    <TableCell>{reseration?.logement.adresse}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">Téléphone</TableHead>
                                    <TableCell>{reseration?.logement.telephone}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">Email</TableHead>
                                    <TableCell>{reseration?.logement.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">Ville</TableHead>
                                    <TableCell>{reseration?.logement.ville}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">Note</TableHead>
                                    <TableCell>{reseration?.logement.note}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead className="font-semibold">Parking</TableHead>
                                    <TableCell>{reseration?.logement.parking ? "Oui" : "Non"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">Nombre de Chambre</TableHead>
                                    <TableCell>{reseration?.logement.nbChambres}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">voir plus..</TableHead>
                                    <TableCell><Link href={`/dashboard/logement/${reseration?.logement.id}`}><Eye /></Link></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    ) : (
                        <Table className="min-w-full border">

                            <TableBody>
                                <TableRow>
                                    <TableHead className="font-semibold">Nom</TableHead>
                                    <TableCell>{reseration?.chambre.hotel.nom}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">Email</TableHead>
                                    <TableCell>{reseration?.chambre.hotel.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">Téléphone</TableHead>
                                    <TableCell>{reseration?.chambre.hotel.telephone}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">Etois</TableHead>
                                    <TableCell>{reseration?.chambre.hotel.etoils}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">voir plus..</TableHead>
                                    <TableCell><Link href={`/dashboard/hotels/${reseration?.chambre.hotel.id}`}><Eye /></Link></TableCell>
                                </TableRow>



                            </TableBody>
                        </Table>
                    )
                }

            </div>

        </>
    );
}