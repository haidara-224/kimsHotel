
"use client";

import { createContext, useContext, useState } from "react";

type FilterContextType = {
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [currentFilter, setCurrentFilter] = useState("tout");
  
  return (
    <FilterContext.Provider value={{ currentFilter, setCurrentFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}