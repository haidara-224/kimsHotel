"use client";
import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Bed, Check, Eye, PencilLine, Star, X } from "lucide-react";
import Link from "next/link";
import { RoleUserHotel } from "@/types/types";
import { getHotelWithUser } from "@/app/(action)/hotel.action";
import Loader from "../Client/Loader";

import { useUser } from "@clerk/nextjs";
export default function HotelDataTableUser() {
    const [hotels, setHotels] = useState<RoleUserHotel[]>([]);
    const [isLoading, setIsloading] = useState(false)


    const { user } = useUser()

    const fetchData = useCallback(async () => {
        try {
            setIsloading(true)
            const data = await getHotelWithUser();

            setHotels(data as unknown as RoleUserHotel[]);
        } catch (e) {
            console.log(e)
        } finally {
            setIsloading(false)
        }
    }, []);
    

    useEffect(() => {
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
                        
                                <TableHead className="hidden lg:table-cell">Address</TableHead>
                                <TableHead className="hidden lg:table-cell">City</TableHead>
                                <TableHead className="hidden lg:table-cell">Dispo/Occupée</TableHead>
                                <TableHead className="hidden lg:table-cell">Etoils</TableHead>
                                <TableHead className="hidden xl:table-cell">Role</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hotels.map((lg) => (
                                <TableRow key={lg?.hotel?.id}>
                                <TableCell>{lg?.hotel?.nom}</TableCell>
                                <TableCell className="hidden lg:table-cell">{lg?.hotel?.adresse}</TableCell>
                                <TableCell className="hidden lg:table-cell">{lg?.hotel?.ville}</TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  {lg?.hotel?.isBlocked ? <X className="text-red-800" /> : <Check className="text-green-600" />}
                                </TableCell>
                                <TableCell className="hidden xl:table-cell">
                                  <div className="flex text-[#D4AF37]">
                                    {Array.from({ length: lg?.hotel?.etoils || 0 }).map((_, index) => (
                                      <Star key={index} className="w-5 h-5" fill="currentColor" />
                                    ))}
                                  </div>
                                </TableCell>
                                
                                <TableCell className="hidden lg:table-cell">
                                  <p className="text-slate-800 dark:text-white">{lg.role.name}</p>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Link href={`/dashboard/hotes/${user?.id}/hotels/${lg?.hotel?.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                                      <Eye className="w-5 h-5" />
                                    </Link>
                                    <Link href={`/dashboard/hotes/${user?.id}/hotels/${lg?.hotel?.id}/chambres`} className="text-green-600 hover:text-green-800 transition-colors">
                                      <Bed className="w-5 h-5" />
                                    </Link>
                                    <Link href={`/dashboard/hotes/${user?.id}/hotels/Edit/${lg?.hotel?.id}`} className="text-yellow-600 hover:text-yellow-800 transition-colors">
                                      <PencilLine className="w-5 h-5" />
                                    </Link>
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