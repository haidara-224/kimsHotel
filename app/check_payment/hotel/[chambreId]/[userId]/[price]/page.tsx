'use client';

import { validerReservationChambre } from "@/app/(action)/reservation.action";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const chambreId = params.chambreId as string;
  const userId = params.userId as string;
  const price = params.price as string;

  const transactionRef = searchParams.get("transaction-reference") || "";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const operationRef = searchParams.get("paycard-operation-reference") || "";
  const c = searchParams.get("c") || "";
  const dateA = searchParams.get("dateA") || "";
  const dateD = searchParams.get("dateD") || "";
  const voyageurs = searchParams.get("voyageurs") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await validerReservationChambre({
        chambreId,
        userId,
        price,
        transactionReference: transactionRef,
        dateA,
        dateD,
        voyageurs,
      });

      router.push("/reservations");
    } catch (err) {
      console.error("Erreur lors de la réservation:", err);
      setError("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Dernière ligne droite</h1>
        <p className="text-xl text-center mb-8">Valider votre réservation</p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6 space-y-2">
          {
            /**
             *           <p><span className="font-semibold">Chambre ID:</span> {chambreId}</p>
          <p><span className="font-semibold">User ID:</span> {userId}</p>
             */
          }

          <p><span className="font-semibold">Prix:</span> {price} GNF</p>
          <p><span className="font-semibold">Date arrivée:</span> {dateA}</p>
          <p><span className="font-semibold">Date départ:</span> {dateD}</p>
          <p><span className="font-semibold">Voyageurs:</span> {voyageurs}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="c" value={c} />
          <input type="hidden" name="transactionRef" value={transactionRef} />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Traitement en cours...' : 'Confirmer la réservation'}
          </button>
        </form>
      </div>
    </div>
  );
}
