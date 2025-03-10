import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { LogementPagination } from "@/src/components/ui/Dashboard/logementPagination";
import { LogementTable } from "@/src/components/ui/Dashboard/LogementTable";

export  default  function Page() {
   
    return (
        <>
        <BackButton text="dashboard" link="/dashboard"/>
            <LogementTable title="Tableau de Logements" limit={10}/>
            <LogementPagination/>
        </>
    );
}