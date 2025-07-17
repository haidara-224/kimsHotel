import { Card, CardContent } from "@/src/components/ui/card";
import { NavBar } from "@/src/components/ui/NavBar";
import { Footers } from "@/src/components/ui/FooterAceuil";
import { ContactUs } from "@/src/components/ui/ContactUs";
import { LastLogement } from "@/src/components/ui/LastLogement";
import { HeaderSection } from "@/src/components/ui/heardersSection";
import MapFilterItems from "@/src/components/ui/MapFilter";
import { ShowItems } from "@/src/components/ui/Client/ShowItems";
import { SidebarFilters } from "@/src/components/ui/Client/filterlateral";



export const metadata = {
  title: "Kims Hotel Guinée - Hôtels & Appartements en Guinée ",
  description: "Réservez les meilleurs hôtels et appartements en Guinée. Offres exclusives et assistance 24/7.",
  alternates: {
    canonical: "https://kimshotel.net",
  },
  openGraph: {
    images: ['/opengraph-image.jpg'],
  },
};

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

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <nav className="bg-white shadow-md fixed w-full z-40 p-2 lg:p-5">
        <NavBar />
      </nav>
      <HeaderSection />
      
      
     
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <h1 className="sr-only">Liste des logements et hôtels disponibles</h1>
          <div className="text-3xl font-semibold mb-8 text-center">
            <MapFilterItems />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <SidebarFilters />
            <div className="w-full self-stretch flex flex-col">
              <ShowItems />
            </div>
          </div>
        </section>
      

    
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

    

      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <ContactUs />
      </section>

      <Footers />
    </div>
  );
}