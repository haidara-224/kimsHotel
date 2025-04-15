import Home from "@/src/components/ui/Client/Home";

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams; // Await the searchParams promise
  return <Home searchParams={resolvedSearchParams} />;
}
