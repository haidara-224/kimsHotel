import { userIsAdmin } from "@/app/(action)/user.action";
import ClientLayout from "@/src/components/ui/Dashboard/ClientLayout";
import { Metadata } from "next";
import { forbidden } from "next/navigation";
export const metadata: Metadata = {
    title: "Dashboard",
    description: "Application de réservation d'hôtel en Guinée et de logement",
};
export default async function Layout({ children }: { children: React.ReactNode }) {
    const isAdmin = await userIsAdmin();
    if (!isAdmin) {
        forbidden();
    }
    return <ClientLayout>{children}</ClientLayout>;   
}
