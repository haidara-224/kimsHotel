import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, token } = body;

    // Get the origin from the request URL
    const { origin } = new URL(request.url);

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <a href="${origin}/reset-password?${token}=${data}">
          Réinitialiser mon mot de passe
        </a>
        <p>Ce lien est valable pendant 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email de réinitialisation envoyé avec succès" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur d'envoi d'email:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
