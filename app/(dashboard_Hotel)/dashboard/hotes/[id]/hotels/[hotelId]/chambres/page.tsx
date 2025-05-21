'use client'

import { Button } from "@/src/components/ui/button";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import HotelChambreData from "@/src/components/ui/Dashboard/HotelChambreData";
import { useUser } from "@clerk/nextjs";
import { PlusCircleIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { user } = useUser();
  const params = useParams();

  const hotelId = typeof params?.hotelId === "string" ? params.hotelId : params?.hotelId?.[0] || "";

  const addChambrePath = () => {
    
    router.push(`/dashboard/hotes/${user?.id}/hotels/${hotelId}/new`);
  };

  return (
    <>
      <BackButton text="Tableau" link={`/dashboard/hotes/${user?.id}/hotels`} />
      <div className="m-5">
        <Button onClick={addChambrePath}>
          <PlusCircleIcon className="mr-2" /> Ajouter une chambre
        </Button>
      </div>
      <HotelChambreData />
    </>
  );
}
