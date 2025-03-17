import { Suspense} from "react";
import { MapFilterItems } from "@/src/components/ui/MapFilter";
import { NavBar } from "@/src/components/ui/NavBar";
import ListinCardHome from "@/src/components/ui/Dashboard/ListinCardHome";
import { homeTypes } from "@/types/types";

import { prisma } from "@/src/lib/prisma";
import { SkeltonCard } from "@/src/components/ui/Client/skeletonCard";
import { unstable_noStore as noStore} from "next/cache";



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
            images:true,
          
            
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
            images:true
          
            
          } 
        } 
      },
      distinct: ['logementId'], 
    }),
  ]);
  console.log(hotels)
  return [
    ...hotels.map(h => ({ type: "hotel", ...h.hotel })),
    ...logements.map(l => ({ type: "logement", ...l.logement })),
  ];
}

export default async function Home(props: { searchParams?: Promise<{ filter?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <>
      <NavBar />
      <div className="container mx-auto px-5 lg:px-10">
        <MapFilterItems />
        <Suspense 
         
          fallback={<SkeletonLoading />}
        >
          <ShowItems searchParams={searchParams ?? {}} />
        </Suspense>
      </div>
    </>
  );
}
const getImageUrls = (item: homeTypes) => {
  if (item.type === "logement") {
    return item.images?.map((img) => img.urlImage) || [];
  } else if (item.type==="hotel"){
   
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
      
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-8 mt-10">
          {datas.map((item, index) => (
          <ListinCardHome
          key={index}
          nom={item.nom}
          type={item.type}
          prix={item.type === "logement" ? item.price : undefined}
          adresse={item.adresse}
          logementId={item.type === 'logement' ? item.id : '' }
          hotelId={item.type === 'hotel' ? item.id : '' }
          urlImage={getImageUrls(item)}
        />
        
          ))}
        </div>
       
        
      
      ) : (
        <h1 className="h-screen flex justify-center items-center text-3xl">
          Aucun établissement n&apos;est enregistré pour cette option.
        </h1>
      )}
    </>
  );
}

function SkeletonLoading(){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-10">
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      <SkeltonCard/>
      
      
    
    </div>
  )
}