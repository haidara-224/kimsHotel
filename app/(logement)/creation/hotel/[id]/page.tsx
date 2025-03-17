import MultiformStepHotel from "@/src/components/ui/Client/MultistepHotel";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { NavBar } from "@/src/components/ui/NavBar";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Creation Hotel",
    description: "Creer Votre Hotel en toute simplicité",
};
export default function Page() {
    return (
        <>
            <NavBar />
            <div className="lg:px-8 min-h-screen mt-3">

                <BackButton text="Back" link="/type-etablissement" />


                <div className="container mx-auto w-full ">
                    <h1 className="text-center text-slate-500 cursor-pointer hover:text-slate-400 hover:transition-all text-3xl ">Inscrivez votre Hotel,et commencez à recevoir des clients !</h1>
                    <MultiformStepHotel />
                </div>
            </div>

        </>

    )
}