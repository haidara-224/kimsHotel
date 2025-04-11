'use client'
import { Button } from "@/src/components/ui/button";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import HotelChambreData from "@/src/components/ui/Dashboard/HotelChambreData";
import { useUser } from "@clerk/nextjs";
import { PlusCircleIcon } from "lucide-react";
export default function Page() {
    const {user}=useUser() 
    return(
        <>
          <BackButton text="Tableau" link={`/dashboard/hotes/${user?.id}/hotels`} />
          <div className="m-5">
          <Button><PlusCircleIcon/></Button>
          </div>
            <HotelChambreData/>
        </>
    )
}