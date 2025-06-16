'use client';
import { useFilter } from "@/contexte/FilterContexte";
import { homeTypes } from "@/types/types";
import { useEffect, useState } from "react";
import ListinCardHome from "../Dashboard/ListinCardHome";
import { getData } from "@/app/(action)/home.action";

const getImageUrls = (item: homeTypes) => {
  return item.images?.map((img) => img.urlImage) || [];
};

export function ShowItems() {
  const { currentFilter } = useFilter();
  const [items, setItems] = useState<homeTypes[]>([]);

  const selectedOption = currentFilter === "tout" ? undefined : currentFilter;

  useEffect(() => {
    async function fetchData() {
      const data = await getData(selectedOption) as unknown as homeTypes[];
      setItems(data);
    }
    fetchData();
  }, [selectedOption]);

  return (
    <>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
          {items.map((item, index) => (
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
