import MultiformStep from "@/src/components/ui/Client/MultiformStep";
import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { NavBar } from "@/src/components/ui/NavBar";

export default function Page() {
    return (
        <>
            <NavBar />
            <div className="px-8 mt-5 min-h-screen py-12">

                <BackButton text="Back" link="/type-etablissement" />


                <div className="container mx-auto">
                    <MultiformStep />
                </div>
            </div>

        </>
    )
}