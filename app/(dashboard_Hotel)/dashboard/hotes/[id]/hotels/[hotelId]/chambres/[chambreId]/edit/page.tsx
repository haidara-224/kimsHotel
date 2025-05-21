"use client"
import EditChambre from "@/src/components/ui/Client/EditChambre";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";


export default function Page(){
  
    const {user} =useUser()
    const params = useParams();
  
    const hotelId = typeof params?.hotelId === "string" ? params.hotelId : params?.hotelId?.[0] || "";
    const chambreId = typeof params?.chambreId === "string" ? params.chambreId : params?.chambreId?.[0] || "";
    return(
        <>
          <BackButton text="Tableau" link={`/dashboard/hotes/${user?.id}/hotels`} />
        <EditChambre hotelId={hotelId} chambreId={chambreId}/>
        </>
    )
}