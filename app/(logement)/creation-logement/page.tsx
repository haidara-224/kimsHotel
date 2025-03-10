
import { StepperCreation } from "@/src/components/ui/Client/Steper";
import { NavBar } from "@/src/components/ui/NavBar";


export default async function Page() {
  
    return (
        <>
        <NavBar/>
        <div className="container mx-auto px-5 lg:px-10 mt-24 flex justify-center flex-col">
        <StepperCreation/>
        </div>
        </>
    );
}
