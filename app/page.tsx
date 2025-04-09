
import { Card, CardContent } from "@/src/components/ui/card";
import { HearderSection } from "@/src/components/ui/heardersSection";

import { MapFilterItems } from "@/src/components/ui/MapFilter";
import { NavBar } from "@/src/components/ui/NavBar";
import { homeTypes } from "@/types/types";

import { prisma } from "@/src/lib/prisma";
import { SkeltonCard } from "@/src/components/ui/Client/skeletonCard";
import { unstable_noStore as noStore } from "next/cache";

import Image from "next/image";
import { Suspense } from "react";
import ListinCardHome from "@/src/components/ui/Dashboard/ListinCardHome";
import { Footers } from "@/src/components/ui/FooterAceuil";
import { ContactUs } from "@/src/components/ui/ContactUs";
import { LastLogement } from "@/src/components/ui/LastLogement";
async function getData({ searchParams }: { searchParams?: { filter?: string } }) {
  noStore()
  //await new Promise(resolve => setTimeout(resolve, 5000));

  const [hotels, logements] = await Promise.all([
    prisma.hotelOptionOnHotel.findMany({
      where: { option: { name: searchParams?.filter } },
      include: {
        hotel: {
          include: {
            hotelOptions: { include: { option: true } },
            categoryLogement: true,
            images: true,


          }
        }
      },
      distinct: ['hotelId'],
    }),
    prisma.logementOptionOnLogement.findMany({
      where: { option: { name: searchParams?.filter } },
      include: {
        logement: {
          include: {
            logementOptions: { include: { option: true } },
            categoryLogement: true,
            images: true


          }
        }
      },
      distinct: ['logementId'],
    }),
  ]);

  return [
    ...hotels.map(h => ({ type: "hotel", ...h.hotel })),
    ...logements.map(l => ({ type: "logement", ...l.logement })),
  ];
}
const getImageUrls = (item: homeTypes) => {
  if (item.type === "logement") {
    return item.images?.map((img) => img.urlImage) || [];
  } else if (item.type === "hotel") {

    return item.images?.map((img) => img.urlImage) || [];
  }
  return [];
};

async function ShowItems({
  searchParams,
}: {
  searchParams: {
    filter?: string;
  };
}) {
  const datas: homeTypes[] = await getData({ searchParams }) as unknown as homeTypes[];




  return (
    <>
      {datas.length > 0 ? (

        <>
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
        </>
        
        



      ) : (
        <h1 className="h-screen flex justify-center items-center text-3xl">
          Aucun établissement n&apos;est enregistré pour cette option.
        </h1>
      )}
    </>
  );
}

function SkeletonLoading() {
  return (
    <>
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />
      <SkeltonCard />



    </>
  )
}

export default async function Home(props: { searchParams?: Promise<{ filter?: string }> }) {




  const features = [
    {
      id: 1,
      icon: "🌟",
      title: "Assurance",
      description:
        "Profitez des meilleurs prix avec annulation gratuite sur la plupart de nos réservations.",
    },
    {
      id: 2,
      icon: "👥",
      title: "Assistance",
      description:
        "Notre support client est à votre disposition 24h/24, 7j/7 pour toute demande d'information",
    },
    {
      id: 3,
      icon: "💎",
      title: "PRESTIGE",
      description:
        "Des services haut de gamme et une sélection exclusive pour des voyages d’exception.",
    }
    
  ];

  
  const searchParams = await props.searchParams;
  

  return (
    <div className="w-full min-h-screen bg-background">
      <nav className="bg-white shadow-md fixed w-full z-40 p-2 lg:p-5">
        <NavBar />
      </nav>

      <>
        <HearderSection />
      </>

      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          <MapFilterItems />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          <Suspense

            fallback={<SkeletonLoading />}
          >
            <ShowItems searchParams={searchParams ?? {}} />
          </Suspense>
        </div>
      </section>
    {
      /**
       *  <section className="relative h-[60vh] sm:h-[80vh] md:h-[100vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aCVDMyVCNHRlbHxlbnwwfHwwfHx8MA%3D%3D"
          alt="Beautiful beach cove"
          className="w-full h-auto object-cover"
          layout="fill"
          objectFit="cover"
        />
      </section>
       */
    }
     



      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-blue-50/50">
        <h2 className="text-3xl font-semibold mb-8 text-center">Pourquoi faire appel à nos services ??</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.id} className="bg-white/80 backdrop-blur-sm">
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
          <LastLogement/>
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-blue-50/50">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    <div>
      <h2 className="text-2xl font-semibold mb-2">DESTINATIONS POPULAIRES</h2>
      <p className="text-gray-600 mb-6">
        Découvrez nos destinations les plus populaires pour vos prochaines vacances.
      </p>
    </div>
    <div className="grid grid-cols-3 gap-2">
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkMarkw2iHRbSodUtRasSFcACPllpypsA24Q&s"
        alt="Travel destination"
        className="w-full h-24 object-cover rounded-md"
        width={100}
        height={100}
      />
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxiyyFdo-OEb9f6k7Hqv9fYB04g0XXiCvPEw&s"
        alt="Travel destination"
        className="w-full h-24 object-cover rounded-md"
        width={100}
        height={100}
      />
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpYDlH9NX6yJ9mQjJi9Epi4cGpYIlP9sUR6A&s"
        alt="Travel destination"
        className="w-full h-24 object-cover rounded-md"
        width={100}
        height={100}
      />
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhfblq7TbDDlGdKyyKRy3ZAvNEeIknW_LSxw&s"
        alt="Travel destination"
        className="w-full h-24 object-cover rounded-md"
        width={100}
        height={100}
      />
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-AVeoAKbDi5DvIUkMr527II4U1ZlkOFj77A&s"
        alt="Travel destination"
        className="w-full h-24 object-cover rounded-md"
        width={100}
        height={100}
      />
      <Image
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGnJdZrFQxtWmCPvts3pqc6EJzJ13q8jyt4Q&s"
        alt="Travel destination"
        className="w-full h-24 object-cover rounded-md"
        width={100}
        height={100}
      />
    </div>
  </div>
</section>


      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <ContactUs/>
      </section>

     <Footers/> 
    </div>
  );
};


