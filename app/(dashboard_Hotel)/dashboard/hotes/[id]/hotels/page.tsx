'use client'


import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import HotelDataTableUser from "@/src/components/ui/Dashboard/HotelDataTableUser";
import { useSession } from "@/src/lib/auth-client";






export default function Page() {
   
   const { data: session } = useSession();

   

    return(
        <>          
            <BackButton text="Dashboard" link={`/dashboard/hotes/${session?.user?.id}`}/>
          
            
              <HotelDataTableUser />
                   
        </>
    )
}