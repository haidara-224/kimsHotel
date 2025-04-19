"use client"; // Si le composant doit gérer de l'interactivité

import { useState, useEffect, useCallback } from "react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Bed, Check, Eye, PencilLine, Star, Trash2, X } from "lucide-react";
import Link from "next/link";

import { Hotel, RoleUserHotel } from "@/types/types";


import { useToast } from "@/src/hooks/use-toast";
import { DeleteHotel, getHotelWithUser } from "@/app/(action)/hotel.action";
import Loader from "../Client/Loader";
import { getRolesUserHotel } from "@/app/(action)/Roles.action";
import { userIsAdmin } from "@/app/(action)/user.action";
import { useUser } from "@clerk/nextjs";
export default function HotelDataTableUser() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isLoading, setIsloading] = useState(false)
    const [roles, setRoles] = useState<RoleUserHotel[]>([])
    const [isAdmin, setIsAdmin] = useState(false)
    const { user } = useUser()
    const chechIsAdmin = async () => {
        const isSuper = await userIsAdmin()
        setIsAdmin(isSuper)

    }
    const { toast } = useToast();
    const fetchData = useCallback(async () => {
        try {
            setIsloading(true)
            const data = await getHotelWithUser();

            setHotels(data as Hotel[]);
        } catch (e) {
            console.log(e)
        } finally {
            setIsloading(false)
        }



    }, []);
    const fetchRolesUser = async () => {
        try {
            const data = await getRolesUserHotel()
            console.log(data)
            setRoles(data as unknown as RoleUserHotel[])
        } catch (error) {
            console.log(error)
        }
    }

    const onDeleteLogement = async (lg: Hotel) => {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce Logement ?")
        if (confirmed) {
            await DeleteHotel(lg)
            fetchData()
            toast({
                title: "Suppression Logement",
                description: "Logement Supprimé avec succès.",
            });

        }
    }

    useEffect(() => {
        chechIsAdmin()
        fetchRolesUser()
        fetchData();
    }, [fetchData])




    return (
        <div className="mt-10 overflow-x-auto">

            {
                isLoading ? <Loader /> :
                    <Table className="min-w-full">
                        <TableCaption>Liste des Hôtels</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden md:table-cell">Category</TableHead>
                                <TableHead className="hidden lg:table-cell">Address</TableHead>
                                <TableHead className="hidden lg:table-cell">City</TableHead>
                                <TableHead className="hidden lg:table-cell">Bloqué/Débloqué</TableHead>
                                <TableHead className="hidden lg:table-cell">Etoils</TableHead>
                                <TableHead className="hidden xl:table-cell">User</TableHead>
                                <TableHead className="hidden xl:table-cell">Role</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hotels.map((lg) => (
                                <TableRow key={lg.id}>
                                    <TableCell>{lg.nom}</TableCell>
                                    <TableCell className="hidden md:table-cell">{lg.categoryLogement.name}</TableCell>
                                    <TableCell className="hidden lg:table-cell">{lg.adresse}</TableCell>
                                    <TableCell className="hidden lg:table-cell">{lg.ville}</TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        {
                                            lg.isBlocked ? <X className="text-red-800" /> : <Check className="text-green-600" />
                                        }
                                    </TableCell>

                                    <TableCell className="hidden xl:table-cell">
                                        <div className="flex text-[#D4AF37]">
                                            {Array.from({ length: lg.etoils || 0 }).map((_, index) => (
                                                <Star key={index} className="w-5 h-5" fill="currentColor" />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">{lg.user.nom}</TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        {roles
                                            .filter((r) => r.hotelId === lg.id) // ou r.hotel.id === lg.id selon ta structure
                                            .map((r) => (
                                                <p key={r.role.id} className="float-right bg-green-600 p-3 text-white rounded-lg">
                                                    {r.role.name}
                                                </p>
                                            ))}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/dashboard/hotes/${user?.id}/hotels/${lg.id}`}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Link>

                                            <Link
                                                href={`/dashboard/hotes/${user?.id}/hotels/${lg.id}/chambres`}
                                                className="text-green-600 hover:text-green-800 transition-colors"
                                            >
                                                <Bed className="w-5 h-5" />
                                            </Link>

                                            <Link
                                                href={`/dashboard/hotes/${user?.id}/hotels/Edit/${lg.id}`}
                                                className="text-yellow-600 hover:text-yellow-800 transition-colors"
                                            >
                                                <PencilLine className="w-5 h-5" />
                                            </Link>

                                            {isAdmin && (
                                                <button
                                                    onClick={() => onDeleteLogement(lg)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
            }

        </div>
    );
}