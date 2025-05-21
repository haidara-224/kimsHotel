'use client';


import { acceptInvitationLogement, getLogementById, UserIsInLogement } from "@/app/(action)/Logement.action";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {  Logement } from "@/types/types";
import { useUser } from "@clerk/nextjs";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { user } = useUser();
  const params = useParams();
  const appartementId = typeof params?.appartementId === 'string' ? params.appartementId : '';
  const [logement, setLogement] = useState<Logement | null>(null);
  const [accepted, setAccepted] = useState(false);
  const router = useRouter()
  const getLogement = useCallback(async () => {
    const data = await getLogementById(appartementId);
    setLogement(data as unknown as Logement);
  }, [appartementId]);
  const [message,setMessage]=useState<string>("")
  useEffect(() => {
    async function checkUserInLogement() {
      if (!user?.id) {
        toast("Vous devez être connecté pour accepter l'invitation.");
        return;
      }
  
      const isInLogement = await UserIsInLogement(appartementId, user.id);
      
      if (isInLogement) {
        setMessage("Vous êtes déjà membre de cet hôtel.");
        toast("Vous êtes déjà membre de cet hôtel.");
        setTimeout(() => {
          router.push(`/`);
        }, 2000);
        return;
      }
    }
  
    checkUserInLogement();
  }, [user?.id, appartementId, router]);
  
  useEffect(() => {
    getLogement();
  }, [getLogement]);

  const handleAcceptInvitation = async () => {
    if (!user?.id) {
      toast("Vous devez être connecté pour accepter l'invitation.");
      return;
    }
  
    setAccepted(true);
    try {
      const response = await acceptInvitationLogement(user.id, appartementId);
  
      if (response?.success) {
        toast(response.message || "Invitation acceptée avec succès !");
        setTimeout(() => {
          router.push(`/dashboard/hotes/${user.id}/appartements/${appartementId}`);
        }, 2000); 
      } else {
        alert(response?.message || "Impossible d'accepter l'invitation.");
        setTimeout(() => {
          router.push(`/`);
        }, 2000);

      }
  
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
      toast.error("Une erreur est survenue.");
    } finally {
      setAccepted(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Invitation à rejoindre un Appartement</h1>
    {message && <p className="text-red-500 text-3xl">{message}</p>}
      <h1>Bonjour {user?.fullName}</h1>
      <h1>Bienvenue chez Kims Hotel, vous avez été invité à rejoindre l’appartement {logement?.nom} :</h1>
      <Separator className="my-4" />
      <h1>Voici les informations de l’appartement :</h1>
      <div>
        <h1>Nom : {logement?.nom}</h1>
        <h1>Adresse : {logement?.adresse}</h1>
        <h1>Téléphone : {logement?.telephone}</h1>
        <h1>Email : {logement?.email}</h1>
      </div>
      <div className="flex items-center justify-center mt-4 space-x-5">
        <Button variant="default" onClick={handleAcceptInvitation} disabled={accepted}>
          {accepted ? "En cours..." : "Accepter l'invitation"}
        </Button>
        <Button variant="destructive" onClick={() => router.push(`/`)}>
          Refuser l&lsquo;invitation
        </Button>
      </div>
    </div>
  );
}
