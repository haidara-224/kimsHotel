import SearchResults from "@/src/components/ui/Client/SearchHebergement"
import { NavBar } from "@/src/components/ui/NavBar"
import { prisma } from "@/src/lib/prisma";


export default async function Page(props: {
  params: Promise<{ origin: string; destination: string; date: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { destination } =await props.params

  return (
    <div className="w-full min-h-screen bg-background">
      <nav className="bg-white shadow-md w-full z-40 p-2 lg:p-5">
        <NavBar />
      </nav>
      <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <SearchResults destination={destination} />
      </div>
    </div>
  )
}


export async function generateStaticParams() {
  const [hotelDestinations, logementDestinations] = await Promise.all([
    prisma.hotel.findMany({
      select: { adresse: true },
      distinct: ["adresse"],
    }),
    prisma.logement.findMany({
      select: { adresse: true },
      distinct: ["adresse"],
    }),
  ]);

  const allDestinations = [
    ...hotelDestinations.map(h => h.adresse),
    ...logementDestinations.map(l => l.adresse),
  ];

  const uniqueDestinations = Array.from(new Set(allDestinations)).filter(
    (d): d is string => typeof d === "string" && d !== null
  );

  // Valeurs par défaut
  const defaultOrigin = "paris";
  const defaultDate = new Date().toISOString().split("T")[0]; // format "YYYY-MM-DD"

  return uniqueDestinations.map(destination => ({
    origin: defaultOrigin,
    destination: destination.toLowerCase(),
    date: defaultDate,
  }));
}


