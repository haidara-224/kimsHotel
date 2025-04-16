import Home from "@/src/components/ui/Client/Home";

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams; 
  return <Home searchParams={resolvedSearchParams} />;
}
