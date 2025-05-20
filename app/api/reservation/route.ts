// /app/api/reserver/route.ts
import { NextResponse } from "next/server";
import Paycard, { PaymentMethod } from 'paycardjs'

// Instanciation de Paycard avec votre clé API
const paycard = new Paycard(process.env.PAYCARD_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { montant, description,c } = body;

    const reference = 'test-reference-ts';

    const createPaymentRequest = {
      amount: montant,
      description: description,
      reference,
      paymentMethod: PaymentMethod.PAYCARD,
      autoRedirect: true,
      c:c,
      callbackUrl: 'https://votre-site.co/api/paiement-callback',
    };


    const response = await paycard.createPayment(createPaymentRequest);

    if (!response?.payment_url) {
      return NextResponse.json({ error: "Erreur lors de la création du paiement" }, { status: 500 });
    }

    const statusResponse = await paycard.getPaymentStatus(reference);
    console.log('Payment status:', statusResponse);
    return NextResponse.json({ url: response.payment_url });
  } catch (error) {
    console.error("Erreur PayCard:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
