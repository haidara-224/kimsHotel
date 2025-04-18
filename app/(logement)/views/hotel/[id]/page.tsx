import ViewHotel from "@/src/components/ui/Client/viewHotel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reserver les chambres d'hotel",
  description: "Reserver vos chambre en guinée",
};
export default function Page() {
 



  return (
    <>
    <ViewHotel/>
    

    </>
  );
}
