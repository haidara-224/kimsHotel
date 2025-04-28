"use client"

import UserLogementDataTable from "@/src/components/ui/Dashboard/UserLogementDataTables";
import { useParams } from "next/navigation";
export default function Page(){
     const params = useParams();
                const logementId = Array.isArray(params.appartementId) ? params.appartementId[0] : params.appartementId || "";
    return (
          
        <>
        <UserLogementDataTable logement={logementId} />
       
        </>
    )
}