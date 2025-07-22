'use client';

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { Input } from "./input";
import { Button } from "./button";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";
import { Search, MapPin, CalendarDays, Hotel, Home } from "lucide-react";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

export function HeaderSection() {
  const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&auto=format&fit=crop&q=80",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [apiLoaded, setApiLoaded] = useState(false);
  const [date, setDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState("hotels");
  
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const guineaBounds = useRef<google.maps.LatLngBounds | null>(null);

  const isFormValid = origin.trim() !== "" && destination.trim() !== "" && date !== undefined;

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

  const onOriginChanged = () => {
    if (originAutocompleteRef.current) {
      const place = originAutocompleteRef.current.getPlace();
      setOrigin(place.formatted_address || place.name || "");
    }
  };

  const onDestinationChanged = () => {
    if (destinationAutocompleteRef.current) {
      const place = destinationAutocompleteRef.current.getPlace();
      const components = place.address_components || [];
      const preferredTypes = ['neighborhood', 'sublocality_level_1', 'sublocality', 'locality'];
      const area = components.find((comp) =>
        comp.types.some((type) => preferredTypes.includes(type))
      );
      setDestination(area?.long_name || place.name || place.formatted_address || "");
    }
  };

  const onSearch = () => {
    if (isFormValid && date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      window.location.href = `recherche/${origin}/${destination}/${dateStr}?type=${activeTab}`;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div key="header-section" className="relative">
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

        <section className="relative h-[500px]  sm:h-[600px] bg-cover bg-center transition-all duration-1000 pt-[100px] sm:pt-[120px] md:pt-[150px]">  <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence>
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${images[currentImage]}')` }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/70" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
            <div className="text-center max-w-4xl px-4 mb-8 sm:mb-12">

              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${currentImage}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.8 }}
                  className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-4 leading-tight"
                >
                  Découvrez les meilleurs hébergements en Guinée
                </motion.h1>
                <motion.p
                  key={`subtitle-${currentImage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-sm sm:text-lg md:text-xl text-gray-200"
                >
                  Trouvez l&apos;hôtel ou l&lsquo;appartement parfait pour votre séjour
                </motion.p>
              </AnimatePresence>
            </div>
            
            {apiLoaded && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full max-w-5xl bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden p-4 sm:p-6"
              >
                <Tabs 
                  defaultValue="hotels" 
                  className="w-full"
                  onValueChange={setActiveTab}
                >
                  <TabsList className="grid grid-cols-2 bg-gray-100 p-1 rounded-lg mb-6 sm:mb-8">

                    <TabsTrigger value="hotels" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Hotel className="w-3 h-3 sm:w-4 sm:h-4" /> Hôtels
                    </TabsTrigger>
                    <TabsTrigger value="appartements" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Home className="w-3 h-3 sm:w-4 sm:h-4" /> Appartements
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <Autocomplete
                          onLoad={onOriginLoad}
                          onPlaceChanged={onOriginChanged}
                          options={{
                            types: ['geocode'],
                            fields: ['formatted_address', 'name']
                          }}
                        >
                          <Input
                            placeholder="D'où venez-vous ?"
                            className="pl-9 sm:pl-10 py-3 sm:py-5 text-sm sm:text-base text-gray-700 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                          />
                        </Autocomplete>
                      </div>

                      
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
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
                            placeholder="Où allez-vous en Guinée ?"
                            className="pl-9 sm:pl-10 py-3  sm:py-5 text-sm sm:text-base text-gray-700 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                          />
                        </Autocomplete>
                      </div>

                     
                      <div className="relative ">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                          <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full pl-9 sm:pl-10 py-3 sm:py-5 h-auto justify-start text-left font-normal text-sm sm:text-base"
                            >
                              {date ? format(date, 'PPP', { locale: fr }) : "Sélectionnez une date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              
                              locale={fr}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <Button 
                      onClick={onSearch}
                      disabled={!isFormValid}
                      className={`w-full py-4 sm:py-6 text-sm sm:text-lg font-semibold shadow-lg transition-all ${
                        isFormValid 
                          ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Trouver des hébergements
                    </Button>
                  </div>
                </Tabs>
              </motion.div>
            )}
          </div>
        </section>
      </LoadScript>
    </div>
  );
}