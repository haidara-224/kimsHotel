"use client"
import EditChambre from "@/src/components/ui/Client/EditChambre";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { useSession } from "@/src/lib/auth-client";

import { useParams } from "next/navigation";


export default function Page(){
  
   const { data: session } = useSession();
    const params = useParams();
  
    const hotelId = typeof params?.hotelId === "string" ? params.hotelId : params?.hotelId?.[0] || "";
    const chambreId = typeof params?.chambreId === "string" ? params.chambreId : params?.chambreId?.[0] || "";
    return(
        <>
          <BackButton text="Tableau" link={`/dashboard/hotes/${session?.user?.id}/hotels`} />
        <EditChambre hotelId={hotelId} chambreId={chambreId}/>
        </>
    )
}