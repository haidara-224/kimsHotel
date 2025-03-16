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

  // Sécurité : si logement n'est pas encore chargé ou s'il n'y a pas d'images
  if (!logement || !logement.images || logement.images.length === 0) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto px-5 lg:px-16 mt-5">
          <h1 className="text-2xl font-bold">Aucune donnée trouvée</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Gallery logement={logement} />
    </>
  );
}
