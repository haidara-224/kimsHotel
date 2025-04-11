'use client'


import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import HotelDataTableUser from "@/src/components/ui/Dashboard/HotelDataTableUser";

import { useUser } from "@clerk/nextjs";




export default function Page() {
   
    const {user}=useUser()

   

    return(
        <>          
            <BackButton text="Dashboard" link={`/dashboard/hotes/${user?.id}`}/>
          
            
              <HotelDataTableUser />
                   
        </>
    )
}