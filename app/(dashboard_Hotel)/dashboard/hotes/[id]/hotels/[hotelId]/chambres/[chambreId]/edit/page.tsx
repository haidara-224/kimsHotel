"use client"
import EditChambre from "@/src/components/ui/Client/EditChambre";
import { useParams } from "next/navigation";


export default function Page(){
  

    const params = useParams();
  
    const hotelId = typeof params.hotelId === "string" ? params.hotelId : params.hotelId?.[0] || "";
    const chambreId = typeof params.chambreId === "string" ? params.chambreId : params.chambreId?.[0] || "";
    return(
        <>
       
        <EditChambre hotelId={hotelId} chambreId={chambreId}/>
        </>
    )
}