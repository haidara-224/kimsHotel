"use client"; // Si le composant doit gérer de l'interactivité

import { useState, useEffect, useCallback } from "react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Eye,Star,Trash2 } from "lucide-react";
import Link from "next/link";
import { BlockedLogement } from "./BlockedLogement";
import { Hotel } from "@/types/types";
import { userIsSuperAdmin } from "@/app/(action)/user.action";
import { Button } from "../button";
import { useToast } from "@/src/hooks/use-toast";
import { BlokedHotelAction, DeleteHotel, getHotel } from "@/app/(action)/hotel.action";

interface HotelDataTableProps {
  limit?: number;
  title?: string;
}

export default function HotelDataTable({ limit, title }: HotelDataTableProps){
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isSuperAdmin,setIsSuperAdmin]=useState(false)
  
    const chechIsSuperAdmin =async()=>{
      const isSuper=await userIsSuperAdmin()
      setIsSuperAdmin(isSuper)
      
    }
    const { toast } = useToast();
    const fetchData = useCallback(async () => {
      const data = await getHotel();
 
      setHotels(limit ? (data as Hotel[]).slice(0, limit) : (data as Hotel[]));


    }, [limit]);
    const onDeleteLogement=async(lg:Hotel)=>{
      const confirmed=window.confirm("Êtes-vous sûr de vouloir supprimer ce Logement ?")
      if(confirmed){
        await DeleteHotel(lg)
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

 
  const onToggle = async (id: string, newStatus: boolean) => {
    await BlokedHotelAction(id);

    setHotels((prev) =>
      prev.map((hl) => (hl.id === id ? { ...hl, isBlocked: newStatus } : hl))
    );
    toast({
        title: "Blocage Hotel",
        description: "Hotel bloquée avec succès.",
      });
  };

  return (
    <div className="mt-10 overflow-x-auto">
      <h3 className="text-2xl mb-4 font-semibold">{title ?? "Hotels"}</h3>
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
                <BlockedLogement
                  id={lg.id}
                  initialBlocked={lg.isBlocked}
                  onToggle={onToggle}
                />
              </TableCell>
           
                 <TableCell className="hidden xl:table-cell">
                <div className="flex text-[#D4AF37]">
                  {Array.from({ length: lg.etoils || 0 }).map((_, index) => (
                    <Star key={index} className="w-5 h-5" fill="currentColor" />
                  ))}
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{lg.user.nom}</TableCell>
              <TableCell className="flex gap-3">
                <Link href={`/dashboard/hotels/${lg.id}`}><Eye /></Link>
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