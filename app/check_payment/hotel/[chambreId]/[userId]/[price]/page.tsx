import { validerReservationChambre } from "@/app/(action)/reservation.action";
import { redirect } from 'next/navigation';
export default async function Page(props: {
  params: Promise<{ chambreId: string; userId: string; price: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { chambreId, userId, price } = await props.params;
  const searchParams = await props.searchParams;

  const operationRef = searchParams["paycard-operation-reference"];
  const c = searchParams.c;
  const transactionRef = searchParams["transaction-reference"];
  const dateA = searchParams.dateA;
  const dateD = searchParams.dateD;
  const voyageurs = searchParams.voyageurs;

  const handleReservation = async (formData: FormData) => {
    "use server";
    await validerReservationChambre({
      chambreId: formData.get("chambreId") as string,
      userId: formData.get("userId") as string,
      price: formData.get("price") as string,
   
      
      transactionReference: formData.get("transactionRef") as string,
      dateA: formData.get("dateA") as string,
      dateD: formData.get("dateD") as string,
      voyageurs: formData.get("voyageurs") as string,
    });
    redirect("/reservations");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Dernière ligne droite</h1>
      <p className="text-2xl font-bold mb-4">Valider votre réservation</p>
      <p>Chambre ID: {chambreId}</p>
      <p>User ID: {userId}</p>
      <p>Price: {price}</p>
      <p>Operation Reference: {operationRef}</p>
      <p>C: {c}</p>
      <p>Transaction Reference: {transactionRef}</p>
      <p>Date arrivée: {dateA}</p>
      <p>Date départ: {dateD}</p>
      <p>Voyageurs: {voyageurs}</p>
      <form
      
        action={async (formData: FormData) => {
          "use server";
          await handleReservation(formData);
        }}
        
        className="flex flex-col space-y-4 mt-8"
      >
        <input type="hidden" name="chambreId" value={chambreId} />
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="price" value={price} />
        
        <input type="hidden" name="c" value={c} />
        <input type="hidden" name="transactionRef" value={transactionRef} />
        <input type="hidden" name="dateA" value={dateA} />
        <input type="hidden" name="dateD" value={dateD} />
        <input type="hidden" name="voyageurs" value={voyageurs} />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Valider
        </button>
      </form>
    </div>
  );
}
