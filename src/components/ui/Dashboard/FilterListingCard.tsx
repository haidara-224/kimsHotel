'use client';

import { useState, useEffect } from 'react';
import { Slider } from '../slider';

interface Listing {
  price: number;
  parking?: boolean;
  hasKitchen?: boolean;
  hasClim?: boolean;
  hasWifi?: boolean;
  hasTV?: boolean;
}

export function FiltersSidebar({ listings, onFilter }: { listings: Listing[]; onFilter: (filtered: Listing[]) => void }) {
    const [priceRange, setPriceRange] = useState([1500, 4000]);
    const [facilities, setFacilities] = useState({
      parking: false,
      hasKitchen: false,
      hasClim: false,
      hasWifi: false,
      hasTV: false,
    });
  
    const handleFacilityChange = (facility: keyof typeof facilities) => {
      setFacilities(prev => ({
        ...prev,
        [facility]: !prev[facility]
      }));
    };
  
    useEffect(() => {
      const filteredListings = listings.filter(listing => {
        const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
        const matchesFacilities = Object.entries(facilities).every(
          ([key, value]) => !value || listing[key as keyof Listing]
        );
        return matchesPrice && matchesFacilities;
      });
      onFilter(filteredListings);
    }, [priceRange, facilities, listings, onFilter]);
  
    return (
      <div className="w-full lg:w-64 p-4 bg-white rounded-lg shadow-md mr-6 sticky">
        <h2 className="text-lg font-semibold mb-4">Services</h2>
        
        <div className="space-y-3 mb-6  grid-cols-4 lg:grid-cols-1 md-grid-cols-3">
          {Object.entries({
            parking: "Parking",
            hasKitchen: "Cuisine",
            hasWifi: "Internet – Wifi",
            hasTV: "Flat Tv",
            hasClim:'Clim'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                id={key}
                checked={facilities[key as keyof typeof facilities]}
                onChange={() => handleFacilityChange(key as keyof typeof facilities)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor={key} className="ml-2 text-sm text-gray-700">
                {label}
              </label>
            </div>
          ))}
        </div>
  
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">logement-Price</h2>
          <div className="mb-2">
            <span className="text-sm font-medium">Price: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={500}
            max={5000}
            step={100}
            className="w-full"
          />
        </div>
      </div>
    );
  }
  