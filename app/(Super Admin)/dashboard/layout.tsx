import { userIsAdmin, userIsSuperAdmin } from "@/app/(action)/user.action";
import ClientLayout from "@/src/components/ui/Dashboard/ClientLayout";
import { getUser } from "@/src/lib/auth.session";
import { Metadata } from "next";
import { forbidden, redirect } from "next/navigation";
export const metadata: Metadata = {
    title: "Dashboard",
    description: "Application de réservation d'hôtel en Guinée et de logement",
};
export default async function Layout({ children }: { children: React.ReactNode }) {
       const user = await getUser()
    if (!user) {
       redirect("/auth/signin")
    }
    const isAdmin = await userIsAdmin();
    const isSuperAdmin = await userIsSuperAdmin();
    if (!isAdmin && !isSuperAdmin) {
        forbidden();
      }
      
    return <ClientLayout>{children}</ClientLayout>;   
}
