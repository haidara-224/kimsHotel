'use client';

import { getDetailsAppartement } from "@/app/(action)/Logement.action";

import { NavBar } from "@/src/components/ui/NavBar";
import { Logement } from "@/types/types";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Gallery from "@/src/components/ui/Client/Gallery";



export default function Page() {
  const [logement, setLogement] = useState<Logement | null>(null);
  

  const params = useParams();
  const logementId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  useEffect(() => {
    const getAppartement = async () => {
      const data = await getDetailsAppartement(logementId) as Logement;
      setLogement(data);
    };
    getAppartement();
  }, [logementId]);

  

  return (
    <>
      <NavBar />
      {logement && <Gallery logement={logement} />}
    </>
  );
}
