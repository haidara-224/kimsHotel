"use client";

import { categoryItems } from "@/app/lib/categoryItems";
import { useFilter } from "@/contexte/FilterContexte";
import { cn } from "@/src/lib/utils";
import Image from "next/image";


export default function MapFilterItems() {
  const { currentFilter, setCurrentFilter } = useFilter();


  return (
    <div className="flex justify-between gap-x-6 mt-2 w-full overflow-x-auto no-scrollbar px-4 py-2">
      {categoryItems.map((item) => (
        <div
          key={item.id}
          className={cn(
            currentFilter === item.name 
              ? "opacity-100 scale-105" 
              : "opacity-60 hover:opacity-90"
          )}
          onClick={() => setCurrentFilter(item.name)}
        >
          <div
            className={cn(
              "relative flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-sm transition-all duration-300 dark:text-white cursor-pointer hover:animate-in",
              currentFilter === item.name 
                ? "border-cyan-500 bg-cyan-100" 
                : "border-gray-300 bg-gray-100"
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
          <p className="text-sm font-medium text-gray-700 dark:text-white">
            {item.title}
          </p>
        </div>
      ))}
    </div>
  );
}