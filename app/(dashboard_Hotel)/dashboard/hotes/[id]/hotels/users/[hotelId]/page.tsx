"use client"

import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { InvitationUserHotelDialogue } from "@/src/components/ui/Dashboard/IvitationUserHotel";
import UserHotelDataTable from "@/src/components/ui/Dashboard/UserHotelDataUserTable";
import { useUser } from "@clerk/nextjs";

import { useParams } from "next/navigation";
export default function Page(){
    
    const {user}=useUser()
     const params = useParams();
                const hotelId = Array.isArray(params?.hotelId) ? params.hotelId[0] : params?.hotelId || "";
    const handdleSubmit=async(email:string)=>{
        try{
            console.log(email)
            const res=await fetch('/api/hotel/invitation',{
                method:'POST',
                body:JSON.stringify({email,hotelId}),
                headers:{
                    'Content-Type':'application/json'
                }
            })
            if(!res.ok){
                console.error('Error')
            }
            const data=await res.json() 
            console.log(data)

        } catch (error) {
            console.error(error);
        }
    }
    return (         
        <>
        <div className="flex justify-between items-center">
        <BackButton text="Tableau" link={`/dashboard/hotes/${user?.id}/hotels`} />
        <InvitationUserHotelDialogue onSubmit={handdleSubmit} />
        </div>
        <UserHotelDataTable hotel={hotelId} />
        </>
    )
}