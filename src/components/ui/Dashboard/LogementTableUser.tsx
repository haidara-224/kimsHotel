"use client";

import { useState, useEffect, useCallback } from "react";
import { getLogementWithUser } from "@/app/(action)/Logement.action";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Check, Eye, PencilLine, X } from "lucide-react";
import Link from "next/link";

import { Logement, RoleUserLogement } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { getRolesUserLogement } from "@/app/(action)/Roles.action";
export function LogementTableUser() {
    const [logements, setLogements] = useState<Logement[]>([]);
    const [roles, setRoles] = useState<RoleUserLogement[]>([])
    const { user } = useUser()
    const fetchData = useCallback(async () => {
        const data = await getLogementWithUser();
        setLogements(data as Logement[]);
    }, []);

    const fetchRolesUser = async () => {
        try {
            const data = await getRolesUserLogement()

            setRoles(data as unknown as RoleUserLogement[])
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {

        fetchData();
        fetchRolesUser()
    }, [fetchData])



    return (
        <div className="mt-10 overflow-x-auto">

            <Table className="min-w-full">
                <TableCaption>Liste des Logements </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead className="hidden lg:table-cell">Address</TableHead>
                        <TableHead className="hidden lg:table-cell">City</TableHead>
                        <TableHead className="hidden lg:table-cell">Dispo/Occupée</TableHead>
                        <TableHead className="hidden xl:table-cell">User</TableHead>
                        <TableHead className="hidden xl:table-cell">Role</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logements.map((lg) => (
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

                            <TableCell className="hidden lg:table-cell">{lg.user.nom}</TableCell>
                            <TableCell className="hidden lg:table-cell">
                                {roles
                                    .filter((r) => r.logementId === lg.id)
                                    .map((r) => (
                                        <p key={r.role.id} className="text-slate-800 dark:text-white">
                                            {r.role.name}
                                        </p>
                                    ))}
                            </TableCell>
                            <TableCell className="flex gap-3">
                                <Link href={`/dashboard/hotes/${user?.id}/appartements/${lg.id}`}><Eye /></Link>

                                <Link
                                                href={`/dashboard/hotes/${user?.id}/appartements/Edit/${lg.id}`}
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
