'use client'
import { Card, CardContent } from "@/src/components/ui/card";
import { HearderSection } from "@/src/components/ui/heardersSection";

const MapFilterItems = dynamic(() => import("@/src/components/ui/MapFilter"), {
    ssr: false, 
  });
import { NavBar } from "@/src/components/ui/NavBar";
import { homeTypes } from "@/types/types";
import { SkeltonCard } from "@/src/components/ui/Client/skeletonCard";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import ListinCardHome from "@/src/components/ui/Dashboard/ListinCardHome";
import { Footers } from "@/src/components/ui/FooterAceuil";
import { ContactUs } from "@/src/components/ui/ContactUs";
import { LastLogement } from "@/src/components/ui/LastLogement";


import Loader from "@/src/components/ui/Client/Loader";
import { getData } from "@/app/(action)/home.action";
import dynamic from "next/dynamic";
const getImageUrls = (item: homeTypes) => {
  if (item.type === "logement") {
    return item.images?.map((img) => img.urlImage) || [];
  } else if (item.type === "hotel") {

    return item.images?.map((img) => img.urlImage) || [];
  }
  return [];
};




function ShowItems({
    searchParams,
  }: {
    searchParams: {
      filter?: string;
    };
  }) {
    const [datas, setData] = useState<homeTypes[]>([]);
    const [isLoading, setIsLoading] = useState(true); // 💡 loading
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;
  
    const fetchsData = useCallback(async () => {
      setIsLoading(true); // ⏳ début loading
      try {
        const resolvedSearchParams = await Promise.resolve(searchParams);
        const data = await getData({ searchParams: resolvedSearchParams }) as unknown as homeTypes[];
        setData(data);
      } catch (error) {
        console.error("Erreur fetch:", error);
        setData([]);
      } finally {
        setIsLoading(false); // ✅ fin loading
      }
    }, [searchParams]);
  
    const scrollPositionRef = useRef(0);
  
    useEffect(() => {
      fetchsData();
    }, [fetchsData, searchParams]);
  
    useEffect(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, [currentPage]);
  
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = datas.slice(startIndex, endIndex);
    const totalPages = Math.ceil(datas.length / ITEMS_PER_PAGE);
  
    const handlePageChange = (page: number) => {
      scrollPositionRef.current = window.scrollY;
      setCurrentPage(page);
    };
  
    const getPageNumbers = () => {
      const pageNumbers: number[] = [];
      const maxPagesToShow = 4;
      if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pageNumbers.push(i);
        }
        if (currentPage < totalPages - 2) {
          pageNumbers.push(-1);
        }
        if (currentPage < totalPages - 1) {
          pageNumbers.push(totalPages);
        }
      }
      return pageNumbers;
    };
  
    return (
      <>
        {isLoading ? (
          <div className="h-screen flex justify-center items-center text-3xl animate-pulse text-gray-400">
            Chargement...
          </div>
        ) : paginatedData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              {paginatedData.map((item, index) => (
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
  
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </button>
  
              <div className="flex gap-2">
                {getPageNumbers().map((page, index) => {
                  if (page === -1) {
                    return <span key={index} className="px-4 py-2">...</span>;
                  }
                  return (
                    <button
                      key={page}
                      className={`px-4 py-2 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
  
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          </>
        ) : (
          <div className="h-screen flex justify-center items-center text-xl text-gray-500">
            Aucune donnée trouvée.
          </div>
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
      <SkeltonCard />
    </>
  )
}



export default function Home({ searchParams }: { searchParams?: { filter?: string } }) {
  const [sc, setSearch] = useState<{ filter?: string } | null>(null);

  useEffect(() => {
    const resolveSearchParams = async () => {
      if (searchParams) {
        setSearch(await Promise.resolve(searchParams)); // Ensure searchParams is awaited
      } else {
        setSearch(null);
      }
    };

    resolveSearchParams();
  }, [searchParams]);
  

 

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
      description: "Bénéficiez d'une assistance 24/7 pour répondre à toutes vos questions.",
    },
    {
      id: 3,
      icon: "💎",
      title: "PRESTIGE",
      description:
        "Des services haut de gamme et une sélection exclusive pour des voyages d’exception.",
    }
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <nav className="bg-white shadow-md fixed w-full z-40 p-2 lg:p-5">
        <NavBar />
      </nav>

      <HearderSection />

      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-3xl font-semibold mb-8 text-center">
    <Suspense fallback={<Loader />}>
      <MapFilterItems />
    </Suspense>
  </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          <div className="w-full self-stretch flex flex-col">
            <Suspense fallback={<SkeletonLoading />}>
            <ShowItems searchParams={sc ?? {}} />
            </Suspense>

          </div>
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-blue-50/50"></section>
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
          <LastLogement />
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
        <ContactUs />
      </section>

      <Footers />
    </div>
  );
}


