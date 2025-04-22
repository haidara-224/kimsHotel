import Home from "@/src/components/ui/Client/Home";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Kims Hotel",
  description: "Trouver des Hotels et Appartements partout en Guinée"
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  return <Home searchParams={resolvedSearchParams} />;
}



