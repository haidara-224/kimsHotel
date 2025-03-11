/*
import { homeTypes } from "@/types/types";
import ListinCardHome from "../Dashboard/ListinCardHome";
import { getData } from "@/app/(action)/home.action";

export async function ShowItems({
  searchParams,
}: {
  searchParams: {
    filter?: string;
  };
}) {
  // On attend les paramètres avant de les utiliser
  const datas: homeTypes[] = await getData({ searchParams });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-10">
      {datas.map((item, index) => (
        <ListinCardHome key={index} nom={item.nom} type={item.type} description={item.description} />
      ))}
    </div>
  );
}
*/