'use client'
import MultiformStepHotelEdit from "@/src/components/ui/Client/MultistepHotelEdit";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { useSession } from "@/src/lib/auth-client";

import { useParams } from "next/navigation";

export default function Page() {
   const { data: session } = useSession();
     const params = useParams();
        const hotelId = Array.isArray(params?.hotelId) ? params.hotelId[0] : params?.hotelId || "";
    
    return(
        <>
          <BackButton text="Tableau" link={`/dashboard/hotes/${session?.user?.id}/hotels`} />
        <MultiformStepHotelEdit hotelId={hotelId}/>
        </>
    )
}