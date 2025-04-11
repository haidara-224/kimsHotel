'use client'
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";

export default function Page() {
    const {user}=useUser()
     const params = useParams();
        const HotelId = Array.isArray(params.hotelId) ? params.hotelId[0] : params.hotelId || "";
    
    return(
        <>
          <BackButton text="Tableau" link={`/dashboard/hotes/${user?.id}/hotels`} />
        edit {HotelId}
        </>
    )
}