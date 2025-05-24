'use client'
import { useCallback, useEffect, useState } from "react"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table"
import { RoleUserHotel } from "@/types/types"
import { getUsersWithLogement, UpdateStatusUserLogement } from "@/app/(action)/Logement.action"
import { Button } from "../button"
import { Switch } from "../switch"
import Image from "next/image"
import { toast } from "sonner"


interface tableProps {
    logement: string
}
export default function UserLogementDataTable({ logement }: tableProps) {
    const [users, setUser] = useState<RoleUserHotel[]>([]);
  
    const [loading,setLoading]=useState(false)
    const fetchData = useCallback(async () => {
        try {
          
            const data = await getUsersWithLogement(logement);

            setUser(data as unknown as RoleUserHotel[]);
        } catch (e) {
            console.log(e)
        } finally {
            
        }
    }, [logement]);
    useEffect(() => {
        fetchData()
    }, [fetchData])
    
        const UpdateStatusUserLogements = async (userLogementId: string) => {
            setLoading(true)
            if (logement) {
                try {
                    await UpdateStatusUserLogement(logement, userLogementId);
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
                                  
                                    <TableHead >Email</TableHead>
                                    <TableHead >Statuts</TableHead>
                                    <TableHead >Role</TableHead>
                                    <TableHead >Image</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((lg) => (
                                    <TableRow key={lg?.user?.id}>
                                        <TableCell >
                                            <p className="text-slate-800 dark:text-white">{lg.user?.name}</p>
                                        </TableCell>

                                        <TableCell >
                                            <p className="text-slate-800 dark:text-white">{lg.user?.email}</p>
                                        </TableCell>
                                        <TableCell >
                                            <p className="text-slate-800 dark:text-white">{lg.active ? 'Active' : 'Inactive'}</p>
                                        </TableCell>
                                        <TableCell >
                                            <p className="text-slate-800 dark:text-white">{lg.role?.name}</p>
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
                                                    onCheckedChange={() => lg.id && UpdateStatusUserLogements(lg.id)}
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
    )
}