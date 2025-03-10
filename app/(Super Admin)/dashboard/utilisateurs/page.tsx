import { BackButton } from "@/src/components/ui/Dashboard/backButton";
import { UserDataTable } from "@/src/components/ui/Dashboard/userDataTble";
export default function Page() {
    return (
        <div>
            <BackButton text="Dashboard" link="/dashboard" />

           <UserDataTable title="Utilisateurs" />
        </div>
    );
}