import { userIsHotelier } from "@/app/(action)/user.action";
import ClientLayouts from "@/src/components/ui/Client/ClientLayout";
import { getUser } from "@/src/lib/auth.session";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kims Hotel- Dashboard",
    description: "Votre Dashboard",
  };
  

import { forbidden, redirect } from "next/navigation";

export default async function Layout({children}: {children: React.ReactNode}) {
    const user = await getUser()
     if (!user) {
        redirect("/auth/signin")
     }
    const isHoterlier = await userIsHotelier();
   
       if (!isHoterlier) {
           forbidden()
       }
    return (
        <ClientLayouts>{children}</ClientLayouts>  
    );
}