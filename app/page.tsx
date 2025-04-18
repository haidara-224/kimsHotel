import Home from "@/src/components/ui/Client/Home";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Trouver des Hotels et Appartements partout en Guinée",
  description: "Trouver et réserver des hôtels et appartements en un clic avec Kims Hotel.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  return <Home searchParams={resolvedSearchParams} />;
}



