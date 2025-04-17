'use client'
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { Input } from "./input";
import { Button } from "./button";

export function HearderSection(){
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
      }, [images.length]);
    return(
        
        <section
        className="relative h-[500px] bg-cover bg-center transition-all duration-1000 pt-[60px] lg:pt-[80px]"
        style={{
          backgroundImage: `url('${images[currentImage]}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Laissez vos rêves vous guider
          </h1>
          <p className="text-lg mb-8">La destination idéale est à portée de clic</p>
  
          <div className="w-full max-w-3xl bg-white rounded-lg p-4 shadow-lg">
            <Tabs defaultValue="flights" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
               
                <TabsTrigger value="hotels">Hôtels</TabsTrigger>
                <TabsTrigger value="Appartements">Appartements</TabsTrigger>
                
              </TabsList>
              <div className="flex flex-col md:flex-row gap-4">
                <Input placeholder="De" className="flex-1" />
                <Input placeholder="À" className="flex-1" />
                <Input placeholder="Départ" type="date" className="flex-1" />
                <Button className="bg-teal-600 hover:bg-teal-700">
                  Rechercher
                </Button>
              </div>
            </Tabs>
          </div>
        </div>
      </section>
    )
}