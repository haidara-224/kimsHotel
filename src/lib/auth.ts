import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "./mailer";
import { nextCookies } from "better-auth/next-js";


const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  /*
  user:{
    additionalFields:{
      prenom:{
        type:'string',
        required:true
      },
      telephone:{
        type:'string',
        required:false
      }
      

    }
  },
  */
  emailAndPassword: {  
    enabled: true,
    async sendResetPassword(data) {
     const resetLink = `https://kimshotel.net/auth/forgot-password?token=${data.token}`;
      //const resetLink = `http://localhost:3000/auth/forgot-password?token=${data.token}`;
      
      await sendEmail(
        data.user.email,
        "Réinitialisation de votre mot de passe",
        `
        <h1>Réinitialisation du mot de passe</h1>
        <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Ce lien expirera dans 1 heure.</p>
        `
      );
    },

  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
    }
  },
  plugins:[nextCookies()]
});