import ViewLogement from "@/src/components/ui/Client/viewLogement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservation ",
  description: "Reserver d'appartement en guinée",
};

export default function Page() {



  return (
    <>
      <ViewLogement />

    </>
  );
}
