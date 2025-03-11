import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { NavBar } from "@/src/components/ui/NavBar";

export default function Page(){
    return(
        <div>
            <NavBar/>
            <BackButton text="Back" link="/type-etablissement"/>
            <div>Hello Appartement</div>
          
        </div>
    )
}