
import { prisma } from "@/src/lib/prisma";
import SearchResults from "@/src/components/ui/Client/SearchHebergement";
import { NavBar } from "@/src/components/ui/NavBar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Page({ params }: any) {
  const { origin, destination, date } = params;

  return (
    <div className="w-full min-h-screen bg-background">
      <nav className="bg-white shadow-md w-full z-40 p-2 lg:p-5">
        <NavBar />
      </nav>
      <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <SearchResults destination={destination} origin={origin} date={date} />
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: any) {
  const { origin, destination, date } = params;

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [hotelCount, logementCount] = await Promise.all([
    prisma.hotel.count({
      where: {
        adresse: { equals: destination, mode: "insensitive" },
      },
    }),
    prisma.logement.count({
      where: {
        adresse: { equals: destination, mode: "insensitive" },
      },
    }),
  ]);

  const total = hotelCount + logementCount;

  return {
    title: `Hébergements à ${destination} | Kims Hotel`,
    description: `Découvrez plus de ${total} hébergements disponibles de ${origin} à ${destination} pour le ${formattedDate}. Réservez dès maintenant.`,
    openGraph: {
      title: `Hébergements à ${destination}`,
      description: `Plus de ${total} logements disponibles pour le ${formattedDate}`,
      url: `https://kimshotel.net/recherche/${origin}/${destination}/${date}`,
      siteName: "Kims Hotel",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Kims Hotel | ${origin} ➝ ${destination}`,
      description: `Réservez parmi ${total} hébergements disponibles pour le ${formattedDate}`,
      images: ["/twitter-image.jpg"],
    },
    icons: {
      icon: "/logoBlanc.png",
    },
    verification: {
      google: "_l9ejk4gq4RUP30Z65C0z_r73lbwWIVC26EDgZ6dIuE",
    },
    metadataBase: new URL("https://kimshotel.net"),
  };
}

// ✅ PARAMÈTRES STATIQUES (SSG)
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
    ...hotelDestinations.map((h) => h.adresse),
    ...logementDestinations.map((l) => l.adresse),
  ];

  const uniqueDestinations = Array.from(new Set(allDestinations)).filter(
    (d): d is string => typeof d === "string" && d !== null
  );

  const defaultOrigin = "paris";
  const defaultDate = new Date().toISOString().split("T")[0];

  return uniqueDestinations.map((destination) => ({
    origin: defaultOrigin,
    destination: destination.toLowerCase(),
    date: defaultDate,
  }));
}
