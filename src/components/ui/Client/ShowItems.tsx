'use client';
import { useFilter } from "@/contexte/FilterContexte";
import { homeTypes } from "@/types/types";
import { useEffect, useState } from "react";
import ListinCardHome from "../Dashboard/ListinCardHome";
import { getData } from "@/app/(action)/home.action";
import { SkeltonCard } from "./skeletonCard";

const getImageUrls = (item: homeTypes) => item.images?.map((img) => img.urlImage) || [];
const filterItems = (
  items: homeTypes[],
  priceRange: [number, number],
  ratingFilter: number,
  currentTypeFilter: string,
  currentOptionFilter: string
) => {
  const normalize = (val?: string) => val?.trim().toLowerCase() || "";

  return items.filter(item => {
    const type = normalize(item.type);

    const typeMatch =
      normalize(currentTypeFilter) === 'tout' || type === normalize(currentTypeFilter);

    const priceMatch = type === "logement"
      ? typeof item.price === 'number' &&
        item.price >= priceRange[0] &&
        item.price <= priceRange[1]
      : true;

    const ratingMatch =
  item.type === 'logement' ||
  ratingFilter === 0 ||
  (item.type === 'hotel' && item.etoils && item.etoils >= ratingFilter);


    const optionFilterActive = normalize(currentOptionFilter) !== 'tout';

    let optionMatch = true;

    if (optionFilterActive) {
      if (type === 'hotel') {
        optionMatch = item.hotelOptions?.some(opt =>
          normalize(opt.option?.name) === normalize(currentOptionFilter)
        ) || false;
      } else if (type === 'logement') {
        optionMatch = item.logementOptions?.some(opt =>
          normalize(opt.option?.name) === normalize(currentOptionFilter)
        ) || false;
      }
    }

    const keep = typeMatch && priceMatch && ratingMatch && optionMatch;

    if (!keep) {
      console.log("Filtré (rejeté)", {
        id: item.id,
        nom: item.nom,
        type,
        price: item.price,
        etoils: item.etoils,
        typeMatch,
        priceMatch,
        ratingMatch,
        optionMatch
      });
    }

    return keep;
  });
};








export function ShowItems() {
const {
  currentTypeFilter,
  currentOptionFilter,
  priceRange,
  ratingFilter
} = useFilter();

  const [filteredItems, setFilteredItems] = useState<homeTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      const data = await getData() as unknown as homeTypes[];
      console.log(data)

      let result = [...data];

      // On applique les filtres côté client
      result = filterItems(result, priceRange, ratingFilter, currentTypeFilter, currentOptionFilter);


      setFilteredItems(result);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [currentOptionFilter, currentTypeFilter, priceRange, ratingFilter]);


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
