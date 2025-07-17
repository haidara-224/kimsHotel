// src/contexte/FilterContexte.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type FilterContextType = {
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  ratingFilter: number;
  setRatingFilter: (rating: number) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [currentFilter, setCurrentFilter] = useState("tout");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  return (
    <FilterContext.Provider 
      value={{ 
        currentFilter, 
        setCurrentFilter,
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