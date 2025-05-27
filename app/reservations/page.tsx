
import { NavBar } from "@/src/components/ui/NavBar";
import Reservationcmpt from "@/src/components/ui/ReservationHotel";

export default function Page() {
   
    return (
        <div className="w-full min-h-screen bg-background">
            <nav className="bg-white shadow-md  w-full z-40 p-2 lg:p-5">
                <NavBar />
            </nav>
            <div className="max-w-5xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-center mb-10">🛎️ Your Reservations</h1>
                <Reservationcmpt/>
            </div>
        </div>

    );
}
