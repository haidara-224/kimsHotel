import { Card, CardContent } from "@/src/components/ui/card";
import { HearderSection } from "@/src/components/ui/heardersSection";
import { NavBar } from "@/src/components/ui/NavBar";
import { homeTypes } from "@/types/types";
import Image from "next/image";
import ListinCardHome from "@/src/components/ui/Dashboard/ListinCardHome";
import { Footers } from "@/src/components/ui/FooterAceuil";
import { ContactUs } from "@/src/components/ui/ContactUs";
import { LastLogement } from "@/src/components/ui/LastLogement";
import { getData } from "@/app/(action)/home.action";
import MapFilterItems from "../MapFilter";

// Fonction utilitaire pour générer les URLs d'images
const getImageUrls = (item: homeTypes) => {
  if (item.type === "logement") {
    return item.images?.map((img) => img.urlImage) || [];
  } else if (item.type === "hotel") {
    return item.images?.map((img) => img.urlImage) || [];
  }
  return [];
};

// Composant pour afficher les éléments avec SSR
async function ShowItems({
  searchParams,
}: {
  searchParams: {
    filter?: string;
  };
}) {
  const datas = await getData({ searchParams }) as unknown as homeTypes[];

  return (
    <>
      {datas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
          {datas.map((item, index) => (
            <ListinCardHome
              key={index}
              nom={item.nom}
              type={item.type}
              prix={item.type === "logement" ? item.price : undefined}
              adresse={item.adresse}
              logementId={item.type === 'logement' ? item.id : ''}
              hotelId={item.type === 'hotel' ? item.id : ''}
              urlImage={getImageUrls(item)}
            />
          ))}
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center text-xl text-gray-500">
          Aucune donnée trouvée.
        </div>
      )}
    </>
  );
}

// Métadonnées pour le SEO
export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string } }) {
  const filter = searchParams?.filter || 'tout';
  const title = filter === 'tout' ? 'Tous nos logements et hôtels' : `Nos ${filter}s`;
  
  return {
    title: `${title} | kims Hotel`,
    description: `Découvrez notre sélection de ${filter === 'tout' ? 'logements et hôtels' : filter + 's'} de qualité.`,
    openGraph: {
      title: `${title} | Kims Hotel`,
      description: `Découvrez notre sélection de ${filter === 'tout' ? 'logements et hôtels' : filter + 's'} de qualité.`,
      images: ['/og-image.jpg'],
    },
  };
}

// Composant principal avec SSR
export default async function HomePage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string } 
}) {
  const features = [
    {
      id: 1,
      icon: "🌟",
      title: "Assurance",
      description: "Profitez des meilleurs prix avec annulation gratuite sur la plupart de nos réservations.",
    },
    {
      id: 2,
      icon: "👥",
      title: "Assistance",
      description: "Bénéficiez d'une assistance 24/7 pour répondre à toutes vos questions.",
    },
    {
      id: 3,
      icon: "💎",
      title: "PRESTIGE",
      description: "Des services haut de gamme et une sélection exclusive pour des voyages d'exception.",
    }
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-md fixed w-full z-40 p-2 lg:p-5">
        <NavBar />
      </nav>

      {/* Section header */}
      <HearderSection />

      {/* Section principale avec filtres et résultats */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h1 className="sr-only">Liste des logements et hôtels disponibles</h1>
        <div className="text-3xl font-semibold mb-8 text-center">
          <MapFilterItems />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full self-stretch flex flex-col">
            <ShowItems searchParams={searchParams ?? {}} />
          </div>
        </div>
      </section>

      {/* Sections supplémentaires pour le SEO */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-blue-50/50 dark:bg-slate-800">
        <h2 className="text-3xl font-semibold mb-8 text-center">Pourquoi faire appel à nos services ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.id} className="bg-white/80 backdrop-blur-sm dark:bg-white/75">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Planifiez une aventure dès aujourd&apos;hui
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LastLogement />
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-blue-50/50 dark:bg-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-2">DESTINATIONS POPULAIRES</h2>
            <p className="text-gray-600 mb-6">
              Découvrez nos destinations les plus populaires pour vos prochaines vacances.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkMarkw2iHRbSodUtRasSFcACPllpypsA24Q&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxiyyFdo-OEb9f6k7Hqv9fYB04g0XXiCvPEw&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpYDlH9NX6yJ9mQjJi9Epi4cGpYIlP9sUR6A&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhfblq7TbDDlGdKyyKRy3ZAvNEeIknW_LSxw&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-AVeoAKbDi5DvIUkMr527II4U1ZlkOFj77A&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGnJdZrFQxtWmCPvts3pqc6EJzJ13q8jyt4Q&s"
            ].map((src, index) => (
              <Image
                key={index}
                src={src}
                alt="Destination de voyage populaire"
                className="w-full h-24 object-cover rounded-md"
                width={100}
                height={100}
                priority={index < 3} // Priorise le chargement des premières images
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section contact */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <ContactUs />
      </section>

      {/* Pied de page */}
      <Footers />
    </div>
  );
}