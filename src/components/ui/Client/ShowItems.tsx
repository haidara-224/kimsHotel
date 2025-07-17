'use client';
import { useFilter } from "@/contexte/FilterContexte";
import { homeTypes } from "@/types/types";
import { useEffect, useState } from "react";
import ListinCardHome from "../Dashboard/ListinCardHome";
import { getData } from "@/app/(action)/home.action";
import { SkeltonCard } from "./skeletonCard";

const getImageUrls = (item: homeTypes) => {
  return item.images?.map((img) => img.urlImage) || [];
};

const filterItems = (items: homeTypes[], priceRange: [number, number], ratingFilter: number) => {
  return items.filter(item => {
    // Filtre par prix
    const priceMatch = item.type === "logement" 
      ? item.price >= priceRange[0] && item.price <= priceRange[1]
      : true;
    
    // Filtre par évaluation
    const ratingMatch = ratingFilter === 0 || ((item?.etoils ?? 0) >= ratingFilter);
    
    return priceMatch && ratingMatch;
  });
};

export function ShowItems() {
  const { currentFilter, priceRange, ratingFilter } = useFilter();
  const [allItems, setAllItems] = useState<homeTypes[]>([]);
  const [filteredItems, setFilteredItems] = useState<homeTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        const data = await getData() as unknown as homeTypes[];
        setAllItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  useEffect(() => {
    // Appliquer les filtres
    let result = [...allItems];
    
    // Filtre par type
    if (currentFilter !== "tout") {
      result = result.filter(item => item.type === currentFilter);
    }
    
    // Autres filtres
    result = filterItems(result, priceRange, ratingFilter);
    
    setFilteredItems(result);
  }, [allItems, currentFilter, priceRange, ratingFilter]);

  if (loading) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
      {[...Array(6)].map((_, i) => <SkeltonCard key={i} />)}
    </div>;
  }

  return (
    <>
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
          {filteredItems.map((item, index) => (
            <ListinCardHome
              key={index}
              nom={item.nom}
              type={item.type}
              prix={item.type === "logement" ? item.price : undefined}
              adresse={item.adresse}
              logementId={item.type === 'logement' ? item.id : ''}
              hotelId={item.type === 'hotel' ? item.id : ''}
              urlImage={getImageUrls(item)}
              rating={item.etoils || 0}
            />
          ))}
        </div>
      ) : (
        <div className="h-64 flex justify-center items-center text-xl text-gray-500">
          Aucune donnée trouvée avec ces filtres.
        </div>
      )}
    </>
  );
}