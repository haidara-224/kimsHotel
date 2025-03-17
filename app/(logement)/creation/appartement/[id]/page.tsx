import MultiformStep from "@/src/components/ui/Client/MultiformStep";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { NavBar } from "@/src/components/ui/NavBar";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Creation Appartement",
    description: "Creer Votre Logement en toute simplicité",
};
export default function Page() {
    return (
        <>
            <NavBar />
            <div className="lg:px-8 min-h-screen mt-3">

                <BackButton text="Back" link="/type-etablissement" />


                <div className="container mx-auto w-full ">
                    <h1 className="text-center text-slate-500 cursor-pointer hover:text-slate-400 hover:transition-all text-xl lg:text-4xl">Inscrivez votre Appartement,et commencez à recevoir des clients !</h1>
                    <MultiformStep />
                </div>
            </div>

        </>
    )
}