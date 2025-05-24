'use client'

import { getLogementDetails } from "@/app/(action)/Logement.action"
import { Logement } from "@/types/types"

import { useEffect, useState } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table"





interface logementProps {
    logementId: string
}
export function DetailsLogement({ logementId }: logementProps) {
    const [logement, setLogement] = useState<Logement | null>(null)

    useEffect(() => {
        async function getLogement() {
            const data = await getLogementDetails(logementId) as unknown as Logement
            setLogement(data)
        }
        getLogement()
    }, [logementId])

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-9">
                <div className="mb-5">
                    <h1>Reservation</h1>
                    <Table className="min-w-full border">

                        <TableHeader>
                            <TableRow>
                                <TableHead>start Date</TableHead>
                                <TableHead className=" md:table-cell">End Date</TableHead>
                                <TableHead className="lg:table-cell">Statuts</TableHead>
                                <TableHead className="lg:table-cell">user</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logement?.reservations?.map((rs) => (
                                <TableRow key={rs.id}>
                                    <TableCell> {rs.startDate &&
                                        new Date(rs.startDate).toLocaleDateString("fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}</TableCell>
                                    <TableCell className=" md:table-cell"> 
                                        {rs.endDate &&
                                        new Date(rs.endDate).toLocaleDateString("fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}</TableCell>
                                    <TableCell className=" lg:table-cell">{rs.status}</TableCell>
                                    <TableCell className="lg:table-cell">{rs.user.name}</TableCell>




                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mb-5">
                    <h1>Information Utilisateur</h1>
                    <Table className="min-w-full border">

                        <TableBody>
                            <TableRow>
                                <TableHead className="font-semibold">Nom</TableHead>
                                <TableCell>{logement?.user.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableCell>{logement?.user.email}</TableCell>
                            </TableRow>
                           



                        </TableBody>
                    </Table>
                </div>



            </div>
            <h1>Information Logement</h1>
            <Table className="min-w-full border">

                <TableBody>
                    <TableRow>
                        <TableHead className="font-semibold">Libellé</TableHead>
                        <TableCell>{logement?.nom}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Adresse</TableHead>
                        <TableCell>{logement?.adresse}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Téléphone</TableHead>
                        <TableCell>{logement?.telephone}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableCell>{logement?.email}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Date de Création</TableHead>
                        <TableCell>
                            {logement?.createdAt &&
                                new Date(logement.createdAt).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Capacity</TableHead>
                        <TableCell>{logement?.capacity}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">nombre De Chambre</TableHead>
                        <TableCell>{logement?.nbChambres}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Prix</TableHead>
                        <TableCell>{logement?.price} GNF</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Surface</TableHead>
                        <TableCell>{logement?.surface} m²</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Parking</TableHead>
                        <TableCell>{logement?.parking ? 'oui' : 'non'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Climatisation</TableHead>
                        <TableCell>{logement?.hasClim ? 'oui' : 'non'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">TV</TableHead>
                        <TableCell>{logement?.hasTV ? 'oui' : 'non'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Cuisine</TableHead>
                        <TableCell>{logement?.hasKitchen ? 'oui' : 'non'}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Wifi</TableHead>
                        <TableCell>{logement?.hasWifi ? 'oui' : 'non'}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableHead className="font-semibold">Favoris</TableHead>
                        <TableCell>{logement?.favorites?.length}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Statut</TableHead>
                        <TableCell>{logement?.isBlocked ? "Bloqué" : "Non Bloqué"}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableHead className="font-semibold">Option</TableHead>
                        <TableCell className="flex items-center gap-4"> {logement?.logementOptions?.map((opt) => (
                            <div key={opt.option.id}>
                                <h3 className=" text-slate-700 font-medium dark:text-slate-300">{opt.option.name}</h3>
                            </div>
                        ))}
                        </TableCell>
                    </TableRow>

                </TableBody>
            </Table>



        </>
    );



}