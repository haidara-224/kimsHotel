'use client';

import { getDetailsAppartement } from "@/app/(action)/Logement.action";
import { NavBar } from "@/src/components/ui/NavBar";
import { Logement } from "@/types/types";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Gallery from "@/src/components/ui/Client/Gallery";
import { CardReservationLogement } from "@/src/components/ui/Client/CardReservationLogement";
import { OptionLogement } from "@/src/components/ui/Client/OptionLogement";
import { Heart, Star } from "lucide-react";
import { LogementSpecificity } from "@/src/components/ui/Client/logementSpecificity";
import { Separator } from "@/src/components/ui/separator";


export default function Page() {
  const [logement, setLogement] = useState<Logement | null>(null);
  const [isLoading, setisLoading] = useState(false);

  const params = useParams();
  const logementId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";


  useEffect(() => {
    const getAppartement = async () => {
      try {
        setisLoading(true);
        const data = await getDetailsAppartement(logementId) as unknown as Logement;
        setLogement(data);
      } catch (e) {
        console.error(e);
      } finally {
        setisLoading(false);
      }
    };
    getAppartement();
  }, [logementId]);


  /*
    function handleSetVoyageurs(value: string): void {
      setVoyageurs(value);
    }
      */

  return (
    <>
      <NavBar />
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50">
          <span className="loaderCharge"></span>
        </div>
      )}
      <div className="container mx-auto px-5 lg:px-16 mt-5">
        {logement && (
          <div>
            <Gallery logement={logement} />
            <div className="mt-5 font-bold text-xl">
              Cet appartement dispose de {logement.nbChambres} chambres et peut accueillir jusqu&apos;à {logement.capacity} personnes.
            </div>
            <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-1 mt-3">
              <p className="lg:mt-1"><span className="font-bold">Ville:</span> {logement?.ville}</p>
              <p><span className="font-bold">Adresse:</span> {logement?.adresse}</p>
              <p><span className="font-bold">Telephone:</span> {logement?.telephone}</p>
              <p><span className="font-bold">Email:</span> {logement?.email}</p>
            </div>
            <section className="rounded-lg mt-5 flex flex-col lg:flex-row justify-between gap-8 relative">

              <div className="w-full lg:w-2/3">
                <p className="mt-3 text-lg text-foreground/80 py-5 font-medium">
                  Cet appartement vous offre un cadre exceptionnel avec ⭐
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <OptionLogement logement={logement} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                  <LogementSpecificity logement={logement} />
                </div>
                <Separator className="mt-5" />
                <section className="flex gap-5 mt-5">
                  <p className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500" /> {logement.avis?.length} Avis
                  </p>
                  <p className="flex items-center gap-1">
                    <Heart className="w-5 h-5 text-red-500" /> {logement.favorites?.length} Favoris
                  </p>
                </section>
              </div>


              <div className="w-full lg:w-1/3 lg:sticky lg:top-20 lg:self-start">
                {logement.disponible ? (
                  <CardReservationLogement logement={logement} />
                ) : (
                 <p className="text-red-600 text-xl font-bold"> Ce logement est déjà réservé.</p>
                )}
              </div>


            </section>

          </div>
        )}
      </div>
    </>
  );
}
