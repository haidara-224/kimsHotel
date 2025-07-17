"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { Input } from "./input";
import { Button } from "./button";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";

export function HeaderSection() {
  const images = [
    "https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&auto=format&fit=crop&q=60",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [apiLoaded, setApiLoaded] = useState(false);

  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const guineaBounds = useRef<google.maps.LatLngBounds | null>(null);

  const initBounds = () => {
    if (window.google) {
      guineaBounds.current = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(7.193, -15.082),
        new window.google.maps.LatLng(12.676, -7.641)
      );
      setApiLoaded(true);
    }
  };

  const onOriginLoad = (autocomplete: google.maps.places.Autocomplete) => {
    originAutocompleteRef.current = autocomplete;
  };

  const onDestinationLoad = (autocomplete: google.maps.places.Autocomplete) => {
    destinationAutocompleteRef.current = autocomplete;
    if (guineaBounds.current) {
      autocomplete.setComponentRestrictions({ country: 'gn' });
      autocomplete.setBounds(guineaBounds.current);
    }
  };

  const getPlaceName = (place: google.maps.places.PlaceResult) => {
    return place.formatted_address || place.name || "";
  };

  const onOriginChanged = () => {
    if (originAutocompleteRef.current) {
      const place = originAutocompleteRef.current.getPlace();
      setOrigin(getPlaceName(place));
    }
  };
const onDestinationChanged = () => {
  if (destinationAutocompleteRef.current) {
    const place = destinationAutocompleteRef.current.getPlace();

    const components = place.address_components || [];

    // On cherche le quartier ou sous-quartier en priorité
    const preferredTypes = ['neighborhood', 'sublocality_level_1', 'sublocality', 'locality'];

    const area = components.find((comp) =>
      comp.types.some((type) => preferredTypes.includes(type))
    );

    setDestination(area?.long_name || place.name || place.formatted_address || "");
  }
};




  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div key="header-section"> 
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={["places"]}
        language="fr"
        onLoad={initBounds}
      >
        <div style={{ display: 'none' }}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100px' }}
            center={{ lat: 9.6412, lng: -13.5784 }}
            zoom={10}
          />
        </div>

        <section
          className="relative h-[500px] bg-cover bg-center transition-all duration-1000 pt-[105px] lg:pt-[80px]"
          style={{ backgroundImage: `url('${images[currentImage]}')` }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <div className="p-2 lg:p-0 flex flex-col justify-center items-center text-center">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${currentImage}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.8 }}
                  className="text-xl md:text-4xl font-bold mb-2"
                >
                  Réservez vos Hôtels & Appartements en Guinée avec Kims Hotel
                </motion.h1>

                <motion.p
                  key={`subtitle-${currentImage}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.8 }}
                  className="text-lg mb-8"
                >
                  Laissez vos rêves vous guider – la destination idéale est à portée de clic
                </motion.p>
              </AnimatePresence>
            </div>

            {apiLoaded && (
              <div className="lg:w-full w-[95%] max-w-3xl bg-white rounded-lg p-4 shadow-lg">
                <Tabs defaultValue="hotels" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="hotels">Hôtels</TabsTrigger>
                    <TabsTrigger value="Appartements">Appartements</TabsTrigger>
                  </TabsList>
                  <div className="flex flex-col md:flex-row gap-4 relative">
                    <div className="w-full relative">
                      <Autocomplete
                        onLoad={onOriginLoad}
                        onPlaceChanged={onOriginChanged}
                        options={{
                          types: ['geocode'],
                          fields: ['formatted_address', 'name']
                        }}
                      >
                        <Input
                          placeholder="Pays/Ville d'origine"
                          className="flex-1 text-slate-700 p-3 border border-gray-300 rounded-lg"
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                        />
                      </Autocomplete>
                    </div>

                    <div className="w-full relative">
                      <Autocomplete
                        onLoad={onDestinationLoad}
                        onPlaceChanged={onDestinationChanged}
                        options={{
                          types: ['geocode'],
                          componentRestrictions: { country: 'gn' },
                          fields: ['formatted_address', 'name', 'address_components']
                        }}
                      >
                        <Input
                          placeholder="Ville/Commune/Quartier en Guinée"
                          className="flex-1 text-slate-700 p-3 border border-gray-300 rounded-lg"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                        />
                      </Autocomplete>

                    </div>

                    <div className="w-full">
                      <Input
                        type="date"
                        className="w-full p-3 text-slate-600 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <Button className="bg-teal-600 hover:bg-teal-700 transition-colors">
                      Rechercher
                    </Button>
                  </div>
                </Tabs>
              </div>
            )}
          </div>
        </section>
      </LoadScript>
    </div>
  );
}