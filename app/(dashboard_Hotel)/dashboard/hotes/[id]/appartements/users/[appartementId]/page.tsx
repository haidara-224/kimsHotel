"use client"

import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { InvitationUserLogementDialogue } from "@/src/components/ui/Dashboard/InvitationUserLogement";
import UserLogementDataTable from "@/src/components/ui/Dashboard/UserLogementDataTables";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
export default function Page(){
    const {user}=useUser()
     const params = useParams();
    const logementId = Array.isArray(params?.appartementId) ? params.appartementId[0] : params?.appartementId || "";
    const handleSubmit=async(email:string)=>{
        try{
            console.log(email)
            const res=await fetch('/api/appartement/invitation',{
                method:'POST',
                body:JSON.stringify({email,logementId}),
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
        <BackButton text="Logement" link={`/dashboard/hotes/${user?.id}/appartements`}  />
        <InvitationUserLogementDialogue onSubmit={handleSubmit}/>
        </div>
        
        <UserLogementDataTable logement={logementId} />
       
        </>
    )
}