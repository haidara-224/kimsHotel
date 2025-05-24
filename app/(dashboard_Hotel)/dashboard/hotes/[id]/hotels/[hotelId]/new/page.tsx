'use client'
import AddChambre from "@/src/components/ui/Client/AddChambre";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { useSession } from "@/src/lib/auth-client";

import { useParams } from "next/navigation";

export default function Page(){
     const params = useParams();
   const { data: session } = useSession();
    const hotelId = typeof params?.hotelId === "string" ? params.hotelId : params?.hotelId?.[0] || "";
    return (
        <>
          <BackButton text="Chambres" link={`/dashboard/hotes/${session?.user?.id}/hotels/${hotelId}/chambres`} />
        <AddChambre hotelId={hotelId}/>
        </>
    )
}