'use client';

import { getDetailsAppartement } from "@/app/(action)/Logement.action";

import { NavBar } from "@/src/components/ui/NavBar";
import { Logement } from "@/types/types";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Gallery from "@/src/components/ui/Client/Gallery";



export default function Page() {
  const [logement, setLogement] = useState<Logement | null>(null);
  const [isLoading,setisLoading]=useState(false)
  

  const params = useParams();
  const logementId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  useEffect(() => {
    const getAppartement = async () => {
      try{
        setisLoading(true)
        const data = await getDetailsAppartement(logementId) as Logement;
        setLogement(data);
      }catch(e){
        console.error(e)
      }finally{

      } setisLoading(false)
      
    };
    getAppartement();
  }, [logementId]);

  

  return (
    <>
      <NavBar />
      {isLoading && (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center  bg-opacity-50">
    <span className="loaderCharge"></span>
  </div>
)}

      {logement && <Gallery logement={logement} />}
    </>
  );
}
