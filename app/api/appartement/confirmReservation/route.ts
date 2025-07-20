import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {render} from "@react-email/render"

import { ReactElement } from "react";
import EmailTemplateAcceptReservationLogement from "@/src/components/ui/Client/EmailTemplateAcceptReservationLogement";

export async function POST(request: Request) {
   try{
    
    
    const { email, logementId } = await request.json();
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const html = await render(EmailTemplateAcceptReservationLogement({ email, logementId }) as unknown as ReactElement);

    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Reservation Confirmée',
        html: html,
    });

        return NextResponse.json({ message: "Email sent successfully!" });
   
    } catch (error) {
        return NextResponse.json({ message: "Error sending email", error: (error as Error).message }, { status: 500 });
    }
}


