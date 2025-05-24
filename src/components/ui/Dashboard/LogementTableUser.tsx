"use client";

import { useState, useEffect, useCallback } from "react";
import { getLogementWithUser } from "@/app/(action)/Logement.action";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Check, Eye, PencilLine, Users, X } from "lucide-react";
import Link from "next/link";

import { RoleUserLogement } from "@/types/types";
import { useSession } from "@/src/lib/auth-client";


export function LogementTableUser() {
    const [logements, setLogements] = useState<RoleUserLogement[]>([]);

    const { data: session } = useSession();
    const fetchData = useCallback(async () => {
        const data = await getLogementWithUser();
        setLogements(data as unknown as RoleUserLogement[]);
    }, []);

    useEffect(() => {

        fetchData();

    }, [fetchData])



    return (
        <div className="mt-10 overflow-x-auto">

            <Table className="min-w-full">
                <TableCaption>Liste des Logements </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>

                        <TableHead className="hidden lg:table-cell">Address</TableHead>
                        <TableHead className="hidden lg:table-cell">City</TableHead>
                        <TableHead className="hidden lg:table-cell">Dispo/Occupée</TableHead>
                        <TableHead className="hidden lg:table-cell">Hotes</TableHead>

                        <TableHead className="hidden xl:table-cell">Role</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logements.filter((lg) => lg.active).map((lg)=> (
                        <TableRow key={lg?.logement?.id}>
                            <TableCell>{lg?.logement?.nom}</TableCell>

                            <TableCell className="hidden lg:table-cell">{lg?.logement?.adresse}</TableCell>
                            <TableCell className="hidden lg:table-cell">{lg?.logement?.ville}</TableCell>

                            <TableCell className="hidden lg:table-cell">
                                {
                                    lg?.logement?.isBlocked ? <X className="text-red-800" /> : <Check className="text-green-600" />
                                }
                            </TableCell>

                            <TableCell className="hidden lg:table-cell">
                                <p className="text-slate-800 dark:text-white">{lg.logement?.user?.name}</p>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                <p className="text-slate-800 dark:text-white">{lg.role.name}</p>
                            </TableCell>

                            <TableCell className="flex gap-3">
                                {
                                    lg.role.name === "ADMIN" && (
                                        <Link href={`/dashboard/hotes/${session?.user?.id}/appartements/users/${lg?.logement?.id}`} className="text-indigo-500 hover:text-indigo-800 transition-colors">
                                            <Users className="w-5 h-5" />
                                        </Link>
                                    )
                                }

                                <Link href={`/dashboard/hotes/${session?.user?.id}/appartements/${lg?.logement?.id}`}><Eye /></Link>

                                <Link
                                    href={`/dashboard/hotes/${session?.user?.id}/appartements/Edit/${lg?.logement?.id}`}
                                    className="text-yellow-600 hover:text-yellow-800 transition-colors"
                                >
                                    <PencilLine className="w-5 h-5" />
                                </Link>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
