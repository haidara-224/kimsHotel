import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { NavBar } from "@/src/components/ui/NavBar";

export default function Page(){
    return (
        <>
        <NavBar/>
        <div className="px-2 py-2 lg:px-8 lg:py-10">
        <BackButton text="Back" link="/type-etablissement"/>
        <div>Hello Hotel</div>
        </div>
       
        </>
        
    )
}