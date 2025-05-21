import Home from "@/src/components/ui/Client/Home";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Kims Hotel Guinée",
  description: "Trouver des Hotels et Appartements partout en Guinée"
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const filteredSearchParams: { [key: string]: string } = Object.fromEntries(
    Object.entries(resolvedSearchParams)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, v]) => typeof v === "string")
      .map(([k, v]) => [k, v as string])
  );
  return <Home searchParams={filteredSearchParams} />;
}



