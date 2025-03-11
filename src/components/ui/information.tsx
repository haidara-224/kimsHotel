'use client'
import Image from "next/image";
//import { useUser } from "@clerk/nextjs";

export function Information(){
   // const {user}=useUser()
//const img= user?.imageUrl
    return (
        <div>
        <Image src="/path-to-image.jpg" alt="Description" width={500} height={300} />
    </div>
    )
}