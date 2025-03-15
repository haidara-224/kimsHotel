import { getCategory } from "@/app/(action)/category.action";
import { NavBar } from "@/src/components/ui/NavBar";
import { Home, Hotel } from "lucide-react";
import Link from "next/link";

export default async function Page() {
   const categoryEtablissement = await getCategory();

   if (!categoryEtablissement || categoryEtablissement.length === 0) {
      return (
         <>
            <NavBar />
            <div className="container mx-auto px-5 lg:px-10 mt-24 flex justify-center flex-col text-center">
               <p className="text-gray-500">Aucune catégorie disponible.</p>
            </div>
         </>
      );
   }

   return (
      <>
         <NavBar />
         <div className="container mx-auto px-5 lg:px-10  flex justify-center flex-col items-center w-full gap-4 mt-10">
         <h1 className="text-3xl mb-10 font-semibold cursor-pointer text-slate-500 hover:text-slate-800  ">Choisir votre type d&apos;etablissements</h1>
            <div className="flex lg:flex-row flex-col justify-center items-center w-full gap-10">
          
            {categoryEtablissement.map((et) => {
               const isHotel = et.name === "Hôtels";
               return (
                  <Link 
                     key={et.id} 
                     href={isHotel ? `/creation/hotel/${et.id}` : `/creation/appartement/${et.id}`} 
                     className="flex flex-col  items-center gap-2 p-20 border rounded-lg hover:bg-gray-100 transition w-full lg:w-1/3  dark:border-white dark:hover:bg-slate-700 dark:text-white"
                     title={`Créer un ${isHotel ? "hôtel" : "appartement"}`}
                  >
                     {isHotel ? <Hotel className="w-10 h-10 text-blue-600" /> : <Home className="w-10 h-10 text-green-600" />}
                     <span>{et.name}</span>
                  </Link>
               );
            })}
            </div>
         
         </div>
      </>
   );
}
