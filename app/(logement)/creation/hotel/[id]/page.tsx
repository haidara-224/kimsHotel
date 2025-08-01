import MultiformStepHotel from "@/src/components/ui/Client/MultistepHotel";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { NavBar } from "@/src/components/ui/NavBar";
import { getUser } from "@/src/lib/auth.session";
import { Metadata } from "next";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
    title: "Creation Hotel",
    description: "Creer Votre Hotel en toute simplicité",
};
export default async function Page() {
        const user = await getUser()
        if (!user) {
           redirect("/auth/signin?redirect=type-etablissement")
        }
          
    return (
        <>
            <div className="w-full min-h-screen bg-background">
                <nav className="bg-white shadow-md w-full z-40 p-2 lg:p-5">
                    <NavBar />
                </nav>
                <div className="lg:px-8 min-h-screen mt-3">

                    <BackButton text="Back" link="/type-etablissement" />


                    <div className="container mx-auto w-full">
                        <h1 className="text-center text-slate-500 cursor-pointer hover:text-slate-400 hover:transition-all text-3xl ">Inscrivez votre Hotel,et commencez à recevoir des clients !</h1>
                        <MultiformStepHotel />
                    </div>
                </div>
            </div>

        </>

    )
}