'use client'
import { deletedUser, getUsers, userIsSuperAdmin } from "@/app/(action)/user.action";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { Trash2 } from "lucide-react";
import { User } from "@/types/types";
import { useToast } from "@/src/hooks/use-toast";
interface UserTableProps {
    title?: string,
    limit?: number
}
export function UserDataTable({ title, limit }: UserTableProps) {
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)
    const [user, setUser] = useState<User[]>([])
    const { toast } = useToast();
    const chechIsSuperAdmin = async () => {
        const isSuper = await userIsSuperAdmin()

        setIsSuperAdmin(isSuper)

    }
    async function fetchData() {
        const data = await getUsers()
        console.log(data)
        setUser(data)

    }
    async function onDelete(id: string) {
        const confirmed = window.confirm('Est vous sure de vouloir supprimé cette reservation ?')
        if (confirmed) {
            await deletedUser(id)
            toast({
                title: "Suppression de l'utilisateur",
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
            <h3 className="text-2xl mb-4 font-semibold">{title ?? "Utilisaters"}</h3>
            <Table className="min-w-full">
                <TableCaption>Liste des Utilisateurs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prenom</TableHead>
                        <TableHead className="md:table-cell">Email</TableHead>
                        <TableHead className="md:table-cell" >Telephone</TableHead>
                        <TableHead className="md:table-cell" >Roles</TableHead>

                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {user.map((ct) => (
                        <TableRow key={ct.id}>
                            <TableCell> {ct.nom}</TableCell>
                            <TableCell> {ct.prenom}</TableCell>
                            <TableCell> {ct.email}</TableCell>
                            <TableCell> {ct.telephone}</TableCell>
                            <TableCell>
                                {ct.roles.map((role) => (
                                    <p key={role.id}>{role.name}</p>
                                ))}
                            </TableCell>
                            <TableCell className="flex gap-3">
                                {
                                    isSuperAdmin &&
                                    <Button className="bg-red-600" disabled={!isSuperAdmin} onClick={() => onDelete(ct.id)}> <Trash2 className="text-white rounded text-xl hover:text-red-800 transition-all cursor-pointer" /></Button>

                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    )
}