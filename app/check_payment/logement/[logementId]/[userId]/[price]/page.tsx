import { Button } from "@/src/components/ui/button";


export default function Page({
  params,
  searchParams,
}: {
  params: { logementId: string; userId: string,price:string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1>Derniere Ligne droite</h1>
      <p className="text-2xl font-bold mb-4">Valider Votre Reservation</p>
      <Button >Valider</Button>

      <p>Logement ID: {params.logementId}</p>
      <p>User ID: {params.userId}</p>
      <p>Price: {params.price}</p>
      <p>Operation Reference: {searchParams["paycard-operation-reference"]}</p>
      <p>C: {searchParams.c}</p>
      <p>Transaction Reference: {searchParams["transaction-reference"]}</p>
    </div>
  );
}
