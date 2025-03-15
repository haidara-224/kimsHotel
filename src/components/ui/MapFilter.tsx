"use client";



import { categoryItems } from "@/app/lib/categoryItems";
import { cn } from "@/src/lib/utils";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function MapFilterItems() {
  const searchParams = useSearchParams();
  const search = searchParams.get("filter");


  const pathName = usePathname();


  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex justify-center gap-x-6 mt-5 w-full overflow-x-auto no-scrollbar px-4 py-2 border-2 bg-white rounded-lg shadow-2xl">
      {categoryItems.map((item) => (
        <Link
          key={item.id}
          href={pathName + "?" + createQueryString("filter", item.name)}
          className={cn(
            "flex flex-col items-center gap-y-2 transition-all duration-300", 
            search === item.name ? "opacity-100 scale-105" : "opacity-60 hover:opacity-90"
          )}
        >
          <div
            className={cn(
              "relative flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-sm transition-all duration-300",
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
          <p className="text-sm font-medium text-gray-700">{item.title}</p>
        </Link>
      ))}
    </div>
  );
}