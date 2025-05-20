


interface Props {
  params: {
    hotelId: string;
    userId: string;
  };
  searchParams: {
    c?: string;
    ['paycard-operation-reference']?: string;
    ['transaction-reference']?: string;
  };
}

export default function CheckPaymentPage({ params, searchParams }: Props) {
  const { hotelId, userId } = params;
  const { c, ['paycard-operation-reference']: operationRef, ['transaction-reference']: transactionRef } = searchParams;

 
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Vérification du paiement</h1>
      <p>Hôtel ID : {hotelId}</p>
      <p>Utilisateur ID : {userId}</p>
      <p>Référence Opération : {operationRef}</p>
      <p>Référence Transaction : {transactionRef}</p>
      <p>Code c : {c}</p>

      {/* Tu peux afficher ici un message de succès ou d’échec selon la réponse API */}
    </div>
  );
}
