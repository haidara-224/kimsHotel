'use client'
import MultiformStepEditLogement from "@/src/components/ui/Client/MultistepEditLogement";
import { useParams } from "next/navigation";

export default function Page(){
     const params = useParams();
            const logementId = Array.isArray(params.appartementId) ? params.appartementId[0] : params.appartementId || "";
    return (
        <>
        <MultiformStepEditLogement logementId={logementId}/>
        </>
    )
}