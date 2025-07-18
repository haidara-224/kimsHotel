'use client';
import { useFilter } from "@/contexte/FilterContexte";
import { homeTypes } from "@/types/types";
import { useEffect, useState } from "react";
import ListinCardHome from "../Dashboard/ListinCardHome";
import { getData } from "@/app/(action)/home.action";
import { SkeltonCard } from "./skeletonCard";

const getImageUrls = (item: homeTypes) => item.images?.map((img) => img.urlImage) || [];

const filterItems = (items: homeTypes[], priceRange: [number, number], ratingFilter: number) => {
  return items.filter(item => {
    const priceMatch = item.type === "logement"
      ? item.price && item.price >= priceRange[0] && item.price <= priceRange[1]
      : true;
    const ratingMatch = ratingFilter === 0 || (item.etoils && item.etoils >= ratingFilter);
    return priceMatch && ratingMatch;
  });
};

export function ShowItems() {
  const { currentFilter, priceRange, ratingFilter } = useFilter();
  const [filteredItems, setFilteredItems] = useState<homeTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const option = currentFilter !== 'tout' ? currentFilter : undefined;
        const data = await getData(option) as unknown as homeTypes[];

        let result = [...data];

        // Ajout des filtres secondaires
        result = filterItems(result, priceRange, ratingFilter);

        setFilteredItems(result);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentFilter, priceRange, ratingFilter]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
        {[...Array(6)].map((_, i) => <SkeltonCard key={i} />)}
      </div>
    );
  }

  return (
    <>
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
          {filteredItems.map((item, index) => (
            <ListinCardHome
              key={`${item.id}-${index}`}
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
