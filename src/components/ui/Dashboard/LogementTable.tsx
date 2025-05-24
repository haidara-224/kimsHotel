"use client"; 

import { useState, useEffect, useCallback } from "react";
import { DeleteLogement, getLogement } from "@/app/(action)/Logement.action";
import { BlokedLogementAction } from "@/app/(action)/Logement.action";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Eye,Trash2 } from "lucide-react";
import Link from "next/link";
import { BlockedLogement } from "./BlockedLogement";
import { Logement } from "@/types/types";
import { userIsSuperAdmin } from "@/app/(action)/user.action";
import { Button } from "../button";
import { useToast } from "@/src/hooks/use-toast";

interface LogementTableProps {
  limit?: number;
  title?: string;
}

export function LogementTable({ limit, title }: LogementTableProps) {
  const [logements, setLogements] = useState<Logement[]>([]);
    const [isSuperAdmin,setIsSuperAdmin]=useState(false)  
    const chechIsSuperAdmin =async()=>{
      const isSuper=await userIsSuperAdmin()
      setIsSuperAdmin(isSuper)  
    }
    const { toast } = useToast();
    const fetchData = useCallback(async () => {
      const data = await getLogement();
      setLogements(limit ? (data as Logement[]).slice(0, limit) : (data as Logement[]));
    }, [limit]);
    const onDeleteLogement=async(lg:Logement)=>{
      const confirmed=window.confirm("Êtes-vous sûr de vouloir supprimer ce Logement ?")
      if(confirmed){
        await DeleteLogement(lg)
        fetchData()
        toast({
          title: "Suppression Logement",
          description: "Logement Supprimé avec succès.",
        });
      
      }
    }
/*
  useEffect(() => {
    
  }, [limit]);
  */
  useEffect(()=>{
    chechIsSuperAdmin()
    fetchData();
  },[fetchData])

  // Fonction client qui appelle la Server Action pour mettre à jour le statut
  const onToggle = async (id: string, newStatus: boolean) => {
    await BlokedLogementAction(id);
    // Optionnel : mettre à jour le tableau local si nécessaire
    setLogements((prev) =>
      prev.map((lg) => (lg.id === id ? { ...lg, isBlocked: newStatus } : lg))
    );
    toast({
      title: "Blocage Logement",
      description: "Logement bloquée avec succès.",
    });
  };

  return (
    <div className="mt-10 overflow-x-auto">
      <h3 className="text-2xl mb-4 font-semibold">{title ?? "Logements"}</h3>
      <Table className="min-w-full">
        <TableCaption>Liste des Logements et Hôtels</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden lg:table-cell">Address</TableHead>
            <TableHead className="hidden lg:table-cell">City</TableHead>
            <TableHead className="hidden lg:table-cell">Bloqué/Débloqué</TableHead>
            <TableHead className="hidden xl:table-cell">User</TableHead>
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
                <BlockedLogement
                  id={lg.id}
                  initialBlocked={lg.isBlocked}
                  onToggle={onToggle}
                />
              </TableCell>
              {
                /*
                 <TableCell className="hidden xl:table-cell">
                <div className="flex text-[#D4AF37]">
                  {Array.from({ length: lg.etoils || 0 }).map((_, index) => (
                    <Star key={index} className="w-5 h-5" fill="currentColor" />
                  ))}
                </div>
              </TableCell>
                */
              }
             
              <TableCell className="hidden lg:table-cell">{lg.user.name}</TableCell>
              <TableCell className="flex gap-3">
                <Link href={`/dashboard/logement/${lg.id}`}><Eye /></Link>
                {
                  isSuperAdmin && 
                  <Button onClick={()=>onDeleteLogement(lg)}><Trash2 className="text-red-400 rounded text-xl hover:text-red-800 transition-all cursor-pointer" /></Button>
                }
                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
