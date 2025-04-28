'use client'
import { useCallback, useEffect, useState } from "react"
import Loader from "../Client/Loader"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table"
import { RoleUserHotel } from "@/types/types"
import { getUsersWithLogement } from "@/app/(action)/Logement.action"
import { Button } from "../button"
import { Switch } from "../switch"
import Image from "next/image"

interface tableProps {
    logement: string
}
export default function UserLogementDataTable({ logement }: tableProps) {
    const [users, setUser] = useState<RoleUserHotel[]>([]);
    const [isLoading, setIsloading] = useState(false)
        const fetchData = useCallback(async () => {
            try {
                setIsloading(true)
                const data = await getUsersWithLogement(logement);
    
                setUser(data as unknown as RoleUserHotel[]);
            } catch (e) {
                console.log(e)
            } finally {
                setIsloading(false)
            }
        }, [logement]);
        useEffect(()=>{
            fetchData()
        }, [fetchData])
    return (
        <>
            <div className="mt-10 overflow-x-auto">

                {
                    isLoading ? <Loader /> :
                        <Table className="min-w-full">
                            <TableCaption>Liste des Utilisateurs</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>

                                
                                    <TableHead >Prenom</TableHead>
                                    <TableHead >Email</TableHead>
                                    
                                    <TableHead >Role</TableHead>
                                    <TableHead >Image</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((lg) => (
                                    <TableRow key={lg?.user?.id}>
                                     
                                        
                                        <TableCell >
                                            <p className="text-slate-800 dark:text-white">{lg.user?.nom}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-slate-800 dark:text-white">{lg.user?.prenom}</p>
                                        </TableCell>
                                        <TableCell >
                                            <p className="text-slate-800 dark:text-white">{lg.user?.email}</p>
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
                                                <Button variant="default" size="sm" className="w-20">
                                                    <Switch
                                                        id="airbnb"
                                                        className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer transition-colors duration-300 ease-in-out data-[state=checked]:bg-blue-600"
                                                        defaultChecked={lg.active}
                                                        onCheckedChange={(checked) => {
                                                            console.log(checked)
                                                        }}
                                                    />
                                                        <span className="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out data-[state=checked]:translate-x-1" />
                                                </Button>

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