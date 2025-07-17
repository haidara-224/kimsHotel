'use client';

import { useFilter } from "@/contexte/FilterContexte";
import { useState } from "react";
import { Button } from "../button";
import { Slider } from "../slider";
import { Star, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "../drawer";

export function SidebarFilters() {
  const {
    currentFilter,
    setCurrentFilter,
    priceRange,
    setPriceRange,
    ratingFilter,
    setRatingFilter
  } = useFilter();

  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // ✅ Drawer contrôlé

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
  };

  const applyPriceFilter = () => {
    setPriceRange(localPriceRange);
    setIsDrawerOpen(false); // ✅ Fermer drawer après filtre
  };

  const handleRatingClick = (rating: number) => {
    setRatingFilter(rating === ratingFilter ? 0 : rating);
    setIsDrawerOpen(false); // ✅ Fermer drawer après filtre
  };

  const handleFilterTypeClick = (filterValue: string) => {
    setCurrentFilter(filterValue);
    setIsDrawerOpen(false); // ✅ Fermer drawer après filtre
  };

  const resetFilters = () => {
    setCurrentFilter("tout");
    setPriceRange([0, 1000000]);
    setRatingFilter(0);
    setLocalPriceRange([0, 1000000]);
    setIsDrawerOpen(false); // ✅ Fermer drawer après reset
  };

  return (
    <>
      {/* Version mobile - Drawer */}
      <div className="lg:hidden">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="mb-4 w-full">
              Afficher les filtres
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[86vh] px-4">
            <div className="space-y-6 p-1">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Filtres</h3>
                <X className="h-5 w-5" />
              </div>
              <FilterContent />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Version desktop - Barre latérale fixe */}
      <div className="hidden lg:block w-72 p-4 border-r dark:border-slate-700 h-[calc(100vh-140px)] sticky top-20 overflow-y-auto">
        <div className="space-y-6 p-1">
          <h3 className="text-xl font-bold">Filtres</h3>
          <FilterContent />
        </div>
      </div>
    </>
  );

  function FilterContent() {
    return (
      <>
        {/* Filtre par type */}
        <div>
          <h4 className="text-sm font-medium mb-3">Type de propriété</h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "tout", label: "Tout" },
              { value: "logement", label: "Apparts" },
              { value: "hotel", label: "Hôtels" }
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={currentFilter === filter.value ? "default" : "outline"}
                onClick={() => handleFilterTypeClick(filter.value)} // ✅
                className="text-xs py-1 h-auto"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Filtre par prix */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium">Prix (GNF)</h4>
            <span className="text-xs text-gray-500">
              {new Intl.NumberFormat('fr-FR').format(localPriceRange[0])} - {new Intl.NumberFormat('fr-FR').format(localPriceRange[1])}
            </span>
          </div>
          <Slider
            min={0}
            max={1000000}
            step={50000}
            value={localPriceRange}
            onValueChange={handlePriceChange}
            className="my-4"
          />
          <Button
            onClick={applyPriceFilter}
            className="w-full"
            size="sm"
            variant="secondary"
          >
            Appliquer prix
          </Button>
        </div>

        {/* Filtre par évaluation */}
        <div>
          <h4 className="text-sm font-medium mb-3">Évaluation</h4>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                onClick={() => handleRatingClick(stars)} // ✅
                className={`flex items-center w-full p-2 rounded-md ${ratingFilter === stars ? 'bg-blue-50 dark:bg-slate-800' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}
              >
                <div className="flex mr-2">
                  {[...Array(stars)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${ratingFilter === stars ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className={`text-sm ${ratingFilter === stars ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {stars === 5 ? '5 étoiles' : `${stars}+ étoiles`}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={resetFilters} // ✅
          variant="outline"
          className="w-full mt-4"
        >
          Réinitialiser
        </Button>
      </>
    );
  }
}
