'use client'
import AddChambre from "@/src/components/ui/Client/AddChambre";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";

export default function Page(){
     const params = useParams();
     const { user } = useUser();
    const hotelId = typeof params?.hotelId === "string" ? params.hotelId : params?.hotelId?.[0] || "";
    return (
        <>
          <BackButton text="Chambres" link={`/dashboard/hotes/${user?.id}/hotels/${hotelId}/chambres`} />
        <AddChambre hotelId={hotelId}/>
        </>
    )
}