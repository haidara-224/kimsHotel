"use client"
import { useCallback, useEffect, useState } from "react"
import Image from "next/image"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table"
import { RoleUserHotel } from "@/types/types"
import { getUsersWithHotel, UpdateStatusUserHotel } from "@/app/(action)/hotel.action"
import { Button } from "../button"
import { CheckCheck, X } from "lucide-react"
import { Switch } from "../switch"
import { toast } from "sonner"
interface tableProps {
    hotel: string
}

export default function UserHotelDataTable({ hotel }: tableProps) {
    const [users, setUser] = useState<RoleUserHotel[]>([]);
    const [loading,setLoading]=useState(false)

    const fetchData = useCallback(async () => {
        try {

            const data = await getUsersWithHotel(hotel);
            setUser(data as unknown as RoleUserHotel[]);
        } catch (e) {
            console.log(e);
        } finally {

        }
    }, [hotel]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const UpdateStatusUserHotels = async (userHotelId: string) => {
        setLoading(true)
        if (hotel) {
            try {
                await UpdateStatusUserHotel(hotel, userHotelId);
                await fetchData(); 
                toast("Statut mis à jour avec succès")
            } catch (error) {
                console.error(error);
            }finally{
                setLoading(false)
            }
        } else {
            console.error("Hotel or User ID is undefined");
        }
    };


    return (
        <>
            <div className="mt-10 overflow-x-auto">
                {

                    <Table className="min-w-full">
                        <TableCaption>Liste des Utilisateurs</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Prenom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Bloqué/Debloqué</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((lg) => (
                                <TableRow key={lg?.user?.id}>
                                    <TableCell>
                                        <p className="text-slate-800 dark:text-white">{lg.user?.prenom}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-slate-800 dark:text-white">{lg.user?.nom}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-slate-800 dark:text-white">{lg.user?.email}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-slate-800 dark:text-white">{lg.role.name}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">

                                            {lg.active ? <CheckCheck className="text-green-600" />   :<X className="text-red-800" />}


                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Image
                                            src={lg?.user?.profileImage || "/default-profile.png"}
                                            alt="user image"
                                            className="w-10 h-10 rounded-full"
                                            width={40}
                                            height={40}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Button variant="destructive" size="sm" className="w-20">
                                                Supprimer
                                            </Button>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={lg.active}
                                                    onCheckedChange={() => lg.id && UpdateStatusUserHotels(lg.id)}
                                                    disabled={loading} 
                                                />
                                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                                    {lg.active ? "Actif" : "Inactif"}
                                                </span>
                                            </div>

                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }
            </div>
        </>
    );
}
