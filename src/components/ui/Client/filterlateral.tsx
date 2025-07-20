'use client';

import { useFilter } from "@/contexte/FilterContexte";
import { useState, useEffect } from "react";
import { Button } from "../button";
import { Slider } from "../slider";
import { Star, X, Filter, ChevronDown, ChevronUp } from "lucide-react";

export function SidebarFilters() {
  const {
    currentTypeFilter,
    setCurrentTypeFilter,
    setCurrentOptionFilter,
    priceRange,
    setPriceRange,
    ratingFilter,
    setRatingFilter
  } = useFilter();
  
  const MAX_PRICE = 30000000; 
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);

  // Fermer les filtres quand on change d'orientation ou de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileFiltersOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
  };

  const applyPriceFilter = () => {
    setPriceRange(localPriceRange);
  };

  const handleRatingClick = (rating: number) => {
    setRatingFilter(rating === ratingFilter ? 0 : rating);
  };

  const handleFilterTypeClick = (filterValue: string) => {
    setCurrentTypeFilter(filterValue);  
  };

  const resetFilters = () => {
    setCurrentOptionFilter("tout");
    setPriceRange([0, MAX_PRICE]);
    setRatingFilter(0);
    setLocalPriceRange([0, MAX_PRICE]);
  };

  const toggleFilterSection = (section: string) => {
    setActiveFilterSection(activeFilterSection === section ? null : section);
  };

  return (
    <>
      {/* Version mobile - Bouton flottant */}
            <div className="lg:hidden fixed bottom-6 right-6 z-30">
        <Button 
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
          variant="default"
        >
          {isMobileFiltersOpen ? <X size={24} /> : <Filter size={24} />}
        </Button>
      </div>


      {/* Overlay mobile */}
      {isMobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileFiltersOpen(false)}
        />
      )}


      {/* Filtres mobiles - Panneau flottant */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 z-20 transition-transform duration-300 ease-in-out ${isMobileFiltersOpen ? 'translate-y-0' : 'translate-y-full'} shadow-2xl rounded-t-2xl p-4`}>
<div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Filtres</h3>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // On empêche la propagation du clic
              setIsMobileFiltersOpen(false);
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh] space-y-4">
          {/* Type de propriété - Accordéon */}
          <div className="border-b dark:border-slate-700 pb-4">
            <button 
              onClick={() => toggleFilterSection('type')}
              className="flex justify-between items-center w-full"
            >
              <h4 className="text-sm font-medium">Type de propriété</h4>
              {activeFilterSection === 'type' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {activeFilterSection === 'type' && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { value: "tout", label: "Tout" },
                  { value: "logement", label: "Apparts" },
                  { value: "hotel", label: "Hôtels" }
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={currentTypeFilter === filter.value ? "default" : "outline"}
                    onClick={() => handleFilterTypeClick(filter.value)}
                    className="text-xs py-1 h-auto"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Filtre par prix - Accordéon */}
          <div className="border-b dark:border-slate-700 pb-4">
            <button 
              onClick={() => toggleFilterSection('price')}
              className="flex justify-between items-center w-full"
            >
              <h4 className="text-sm font-medium">Prix (GNF)</h4>
              {activeFilterSection === 'price' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {activeFilterSection === 'price' && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-500">
                    {new Intl.NumberFormat('fr-FR').format(localPriceRange[0])}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Intl.NumberFormat('fr-FR').format(localPriceRange[1])}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={MAX_PRICE}
                  step={50000}
                  value={localPriceRange}
                  onValueChange={handlePriceChange}
                  className="my-2"
                />
                <Button
                  onClick={applyPriceFilter}
                  className="w-full mt-2"
                  size="sm"
                  variant="secondary"
                >
                  Appliquer
                </Button>
              </div>
            )}
          </div>

          {/* Évaluation - Accordéon */}
          <div className="border-b dark:border-slate-700 pb-4">
            <button 
              onClick={() => toggleFilterSection('rating')}
              className="flex justify-between items-center w-full"
            >
              <h4 className="text-sm font-medium">Évaluation</h4>
              {activeFilterSection === 'rating' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {activeFilterSection === 'rating' && (
              <div className="space-y-2 mt-3">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => handleRatingClick(stars)} 
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
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={resetFilters}
            variant="outline"
            className="flex-1"
          >
            Réinitialiser
          </Button>
          <Button
            onClick={() => setIsMobileFiltersOpen(false)}
            className="flex-1"
          >
            Voir résultats
          </Button>
        </div>
      </div>

      {/* Version desktop - inchangée */}
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
                variant={currentTypeFilter === filter.value ? "default" : "outline"}
                onClick={() => setCurrentTypeFilter(filter.value)}
                className="text-xs py-1 h-auto"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium">Prix App (GNF)</h4>
            <span className="text-xs text-gray-500">
              {new Intl.NumberFormat('fr-FR').format(localPriceRange[0])} - {new Intl.NumberFormat('fr-FR').format(localPriceRange[1])}
            </span>
          </div>
          <Slider
            min={0}
            max={MAX_PRICE}
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

        <div>
          <h4 className="text-sm font-medium mb-3">Évaluation</h4>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                onClick={() => handleRatingClick(stars)} 
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
          onClick={resetFilters} 
          variant="outline"
          className="w-full mt-4"
        >
          Réinitialiser
        </Button>
      </>
    );
  }
}