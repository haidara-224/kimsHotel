"use client";

import { categoryItems } from "@/app/lib/categoryItems";
import { cn } from "@/src/lib/utils";
import Image from "next/image";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

export default function MapFilterItems() {
  const searchParams = useSearchParams();
  const search = searchParams.get("filter");
  const pathName = usePathname();
  const router = useRouter();

  // Utilisation d'un ref pour garder une référence du scroll
  const prevScrollPos = useRef(0);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );


  // Pour éviter le scroll vers le haut
  useEffect(() => {
    
    if (search) {
     
      window.scrollTo(0, prevScrollPos.current); 
    }
  }, [search]);

  const handleCategoryClick = (category: string) => {
    if (category === "tout") {     
      router.push("/", { scroll: false });
    } else {
     
      prevScrollPos.current = window.pageYOffset;
      router.push(pathName + "?" + createQueryString("filter", category), { scroll: false });
    }
  };
  

  return (
    <div className="flex justify-between gap-x-6 mt-2 w-full overflow-x-auto no-scrollbar px-4 py-2 ">
      {categoryItems.map((item) => (
        <div
          key={item.id}
          className={cn(
            "flex flex-col items-center gap-y-2 transition-all duration-300", 
            search === item.name ? "opacity-100 scale-105" : "opacity-60 hover:opacity-90"
          )}
          onClick={() => handleCategoryClick(item.name)}// Gérer le clic sur la catégorie
        >
          <div
            className={cn(
              "relative flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-sm transition-all duration-300 dark:text-white",
              search === item.name ? "border-cyan-500 bg-cyan-100" : "border-gray-300 bg-gray-100"
            )}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-white">{item.title}</p>
        </div>
      ))}
    </div>
  );
}
