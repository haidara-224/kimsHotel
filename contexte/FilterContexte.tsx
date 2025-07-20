"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type FilterContextType = {
  currentTypeFilter: string;
  setCurrentTypeFilter: (filter: string) => void;
  currentOptionFilter: string;
  setCurrentOptionFilter: (filter: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  ratingFilter: number;
  setRatingFilter: (rating: number) => void;
};


const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [currentTypeFilter, setCurrentTypeFilter] = useState("tout");
  const [currentOptionFilter, setCurrentOptionFilter] = useState("tout");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  return (
    <FilterContext.Provider
      value={{
        currentTypeFilter,
        setCurrentTypeFilter,
        currentOptionFilter,
        setCurrentOptionFilter,
        priceRange,
        setPriceRange,
        ratingFilter,
        setRatingFilter
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}




export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}