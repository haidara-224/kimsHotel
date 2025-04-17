import Home from "@/src/components/ui/Client/Home";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Trouver des Hotels et Appartement patout en Guinée",
  description: "Trouver des Hotel et appartement en un clique",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams; 
  return <Home searchParams={resolvedSearchParams} />;
}
