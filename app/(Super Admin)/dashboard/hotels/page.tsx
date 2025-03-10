import { BackButton } from "@/src/components/ui/Dashboard/backButton";

import HotelDataTable from "@/src/components/ui/Dashboard/HotelDataTable";


export default function Page() {
   
    return (
        <>
        <BackButton text="Dashboard" link="/dashboard" />
        <HotelDataTable />
    
        </>
    );
}