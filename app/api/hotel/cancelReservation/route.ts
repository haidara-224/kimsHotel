import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {render} from "@react-email/render"
import { ReactElement } from "react";
import EmailTemplateRejectReservation from "@/src/components/ui/Client/EmaiTemplateRejectReservation";
export async function POST(request: Request) {
   try{  
    const { email, hotelId } = await request.json();
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const html = await render(EmailTemplateRejectReservation({ email, hotelId }) as unknown as ReactElement);

    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Reservation Annulée',
        html: html,
    });

        return NextResponse.json({ message: "Email sent successfully!" });
   
    } catch (error) {
        return NextResponse.json({ message: "Error sending email", error: (error as Error).message }, { status: 500 });
    }
}


