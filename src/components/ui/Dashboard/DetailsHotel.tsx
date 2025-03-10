'use client'
import { Hotel } from "@/types/types"

import { useEffect, useState } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table"
import { getHotelsDetails } from "@/app/(action)/hotel.action"





interface HotelProps {
    hotelId: string
}
export function DetailsHotel({ hotelId }: HotelProps) {
    const [hotel, setHotel] = useState<Hotel | null>(null)

    async function getLogement() {
        const data = await getHotelsDetails(hotelId)
        console.log(data)
        setHotel(data)

    }

    useEffect(() => {

        getLogement()
    }, [hotelId])

    return (
        <div className="">
            <div className="grid grid-cols-1">
                <div className="mb-5">
                    <h1>Reservation</h1>
                    <Table className="min-w-full border">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Start Date</TableHead>
                                <TableHead className="md:table-cell">End Date</TableHead>
                                <TableHead className="lg:table-cell">Status</TableHead>
                                <TableHead className="lg:table-cell">Nom</TableHead>
                                <TableHead className="lg:table-cell">Email</TableHead>
                                <TableHead className="lg:table-cell">Tel</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hotel?.chambres?.map((chambre) => (
                                chambre.reservations.map((reservation) => ( // Boucle sur les réservations
                                    <TableRow key={reservation.id}>
                                        <TableCell>
                                            {reservation.startDate &&
                                                new Date(reservation.startDate).toLocaleDateString("fr-FR", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                        </TableCell>
                                        <TableCell>
                                            {reservation.endDate &&
                                                new Date(reservation.endDate).toLocaleDateString("fr-FR", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                        </TableCell>
                                        <TableCell>{reservation.status}</TableCell>
                                        <TableCell>{reservation.user.nom}</TableCell>
                                        <TableCell>{reservation.user.email}</TableCell>
                                        <TableCell>{reservation.user.telephone}</TableCell>
                                    </TableRow>
                                ))
                            ))}
                        </TableBody>
                    </Table>

                </div>
                {
                    /*
                    <div className="mb-5">
                    <h1>Information Utilisateur</h1>
                    <Table className="min-w-full border">

                        <TableBody>
                            <TableRow>
                                <TableHead className="font-semibold">Nom</TableHead>
                                <TableCell>{logement?.user.nom}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableCell>{logement?.user.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead className="font-semibold">Téléphone</TableHead>
                                <TableCell>{logement?.user.telephone}</TableCell>
                            </TableRow>



                        </TableBody>
                    </Table>
                </div>
                    */
                }




            </div>
            <div className="grid grid-cols-1">
                <div className="mb-5">
                    <h1>Utilisateur Gestionnaire</h1>
                    <Table className="min-w-full border">
                        <TableHeader>
                            <TableRow>

                                <TableHead className="lg:table-cell">Nom</TableHead>
                                <TableHead className="lg:table-cell">Prenom</TableHead>
                                <TableHead className="lg:table-cell">Email</TableHead>
                                <TableHead className="lg:table-cell">Tel</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            <TableRow key={hotel?.id}>

                                <TableCell>{hotel?.user.nom}</TableCell>
                                <TableCell>{hotel?.user.email}</TableCell>
                                <TableCell>{hotel?.user.prenom}</TableCell>
                                <TableCell>{hotel?.user.telephone ? hotel?.user.telephone : '-----'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                </div>
            
                



            </div>
            
              
                 <h1>Information Hotel</h1>
            <Table className="min-w-full border">

                <TableBody>
                    <TableRow>
                        <TableHead className="font-semibold">Libellé</TableHead>
                        <TableCell>{hotel?.nom}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Adresse</TableHead>
                        <TableCell>{hotel?.adresse}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Téléphone</TableHead>
                        <TableCell>{hotel?.telephone}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableCell>{hotel?.email}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Date de Création</TableHead>
                        <TableCell>
                            {hotel?.createdAt &&
                                new Date(hotel.createdAt).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Chambres</TableHead>
                        <TableCell>{hotel?.chambres.length}</TableCell>
                    </TableRow>
                  
                    <TableRow>
                        <TableHead className="font-semibold">Parking</TableHead>
                        <TableCell>{hotel?.parking ? 'oui' : 'non'}</TableCell>
                    </TableRow>
                   
                 

                    <TableRow>
                        <TableHead className="font-semibold">Favoris</TableHead>
                        <TableCell>{hotel?.favorites?.length}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Avis</TableHead>
                        <TableCell>{hotel?.avis?.length}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Statut</TableHead>
                        <TableCell>{hotel?.isBlocked ? "Bloqué" : "Non Bloqué"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Option</TableHead>
                        <TableCell className="flex items-center gap-4"> {hotel?.hotelOptions?.map((opt) => (
                            <div key={opt.option.id}>
                                <h3 className=" text-slate-700 font-medium dark:text-slate-300">{opt.option.name}</h3>
                            </div>
                        ))}
                        </TableCell>
                    </TableRow>

                </TableBody>
            </Table>
            



        </div>
    );



}