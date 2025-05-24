'use client'
import { userIsSuperAdmin } from "@/app/(action)/user.action";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { Eye, Trash2 } from "lucide-react";
import { Reservation } from "@/types/types";
import { deleteReservation, getReservation } from "@/app/(action)/reservation.action";
import { useToast } from "@/src/hooks/use-toast";
import Link from "next/link";


interface ReservationTableProps {
    title?: string,
    limit?: number

}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ReservationDataTable({ title, limit }: ReservationTableProps) {
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)
    const [reservation, setReservation] = useState<Reservation[]>([])
    const { toast } = useToast();
    const chechIsSuperAdmin = async () => {
        const isSuper = await userIsSuperAdmin()
       
        setIsSuperAdmin(isSuper)

    }
    async function fetchData() {
        const data = await getReservation() as unknown as Reservation[];
        setReservation(data)

    }
    async function onDelete(id:string) {
        const confirmed=window.confirm('Est vous sure de vouloir supprimé cette reservation ?')
        if(confirmed){
            await deleteReservation(id)
            toast({
                title: "Suppression de la Réservations",
                description: "Reservations Supprimée avec succès.",
              });
            fetchData()
        }
    }
    useEffect(() => {
        chechIsSuperAdmin()
        fetchData()

    }, [])
    return (
        <div className="mt-10 overflow-x-auto">
            <h3 className="text-2xl mb-4 font-semibold">{title ?? "Reservations..."}</h3>
            <Table className="min-w-full">
                <TableCaption>Liste des Reservations</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Hote</TableHead>
                        <TableHead className="hidden md:table-cell">Date Debut de sejours</TableHead>
                        <TableHead className="hidden md:table-cell" >Date De Fin de Sejours</TableHead>
                        <TableHead className="hidden md:table-cell" >Statut</TableHead>
                        
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reservation.map((ct) => (
                        <TableRow key={ct.id}>
                             <TableCell> {ct.user.name}</TableCell>
                             <TableCell> {ct.logement ? `${ct.logement.nom}- Logement` : `${ct.chambre?.hotel?.nom} - Hotel`}</TableCell>

                            <TableCell className="hidden md:table-cell"> {ct?.startDate && new Date(ct.startDate).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}</TableCell>

                            <TableCell className="hidden md:table-cell"> {ct?.endDate && new Date(ct.endDate).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}</TableCell>
                             <TableCell className="hidden md:table-cell"> {ct.status}</TableCell>


                            <TableCell className="flex gap-3">
                                {
                                    isSuperAdmin &&
                                    <Button className="bg-red-600" disabled={!isSuperAdmin} onClick={()=>onDelete(ct.id)}> <Trash2 className="text-white rounded text-xl hover:text-red-800 transition-all cursor-pointer" /></Button>

                                }
                                <Link href={`/dashboard/reservations/${ct.id}`} className="bg-green-600 py-1 px-3 rounded hover:bg-slate-950 " > <Eye className="text-white rounded text-xl  transition-all cursor-pointer" /></Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    )
}