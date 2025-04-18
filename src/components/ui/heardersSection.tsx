'use client'

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { Input } from "./input";
import { Button } from "./button";
import { motion, AnimatePresence } from "framer-motion";

export function HearderSection() {
  const images = [
    "https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8SG90ZWx8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEhvdGVsfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SG90ZWx8ZW58MHx8MHx8fDA%3D",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative h-[500px] bg-cover bg-center transition-all duration-1000 pt-[105px] lg:pt-[80px]"
      style={{
        backgroundImage: `url('${images[currentImage]}')`,
      }}
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
            <div className="flex flex-col md:flex-row gap-4">
              <Input placeholder="De" className="flex-1 text-slate-700 p-3 lg:p-0" />
              <Input placeholder="À" className="flex-1 text-slate-700 p-3 lg:p-0" />
              <Input placeholder="Départ" type="date" className="flex-1 p-3 lg:p-0   text-slate-600" />
              <Button className="bg-teal-600 hover:bg-teal-700">Rechercher</Button>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
