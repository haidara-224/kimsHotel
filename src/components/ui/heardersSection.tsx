"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { Input } from "./input";
import { Button } from "./button";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";

export function HearderSection() {
  const images = [
    "https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&auto=format&fit=crop&q=60",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [destination, setDestination] = useState("");

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setDestination(place.formatted_address);
      } else if (place.name) {
        setDestination(place.name);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    width: "100%",
    height: "0px",
  };

  const center = {
    lat: 9.6412,
    lng: -13.5784,
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places"]}
    >
      <section
        className="relative h-[500px] bg-cover bg-center transition-all duration-1000 pt-[105px] lg:pt-[80px]"
        style={{ backgroundImage: `url('${images[currentImage]}')` }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <div className="p-2 lg:p-0 flex flex-col justify-center items-center text-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentImage + "-title"}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.8 }}
                className="text-xl md:text-4xl font-bold mb-2"
              >
                Réservez vos Hôtels & Appartements en Guinée avec Kims Hotel
              </motion.h1>

              <motion.p
                key={currentImage + "-subtitle"}
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

          <div className="lg:w-full w-[95%] max-w-3xl bg-white rounded-lg p-4 shadow-lg">
            <Tabs defaultValue="flights" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="hotels">Hôtels</TabsTrigger>
                <TabsTrigger value="Appartements">Appartements</TabsTrigger>
              </TabsList>
              <div className="flex flex-col md:flex-row gap-4 relative">
              <div className="w-full relative">
                <Input placeholder="D'où partez-vous ?" className="flex-1 text-slate-700 p-3 lg:p-0" />
              </div>

                <div className="w-full relative">
                  <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <Input
                      ref={inputRef}
                      placeholder="Où allez-vous ?"
                      className="flex-1 text-slate-700 p-3 border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </Autocomplete>
                </div>

                <div className="w-full">
                  <Input
                    type="date"
                    className="w-full p-3 pr-10 text-slate-600 border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                  />
                </div>

                <Button className="bg-teal-600 hover:bg-teal-700">Rechercher</Button>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Invisible Map Loader (pour charger l'API proprement) */}
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} />
      </section>
    </LoadScript>
  );
}
