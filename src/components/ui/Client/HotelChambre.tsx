'use client';

import { Chambre, Hotele } from "@/types/types";
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../carousel";
import Image from "next/image";
import { Bed, CheckCircle, Tv2, Utensils, Wifi, XCircle } from "lucide-react";
import { CardReservationHotel } from "./CardReservationHotel";


interface HotelProps {
  hotel: Hotele;
}

export function HotelChambre({ hotel }: HotelProps) {
  const [hoveredCarousel, setHoveredCarousel] = useState<number | null>(null);
  const [selectedChambre, setSelectedChambre] = useState<Chambre | null>(null);


  const [open,setOpenChange]=useState(false)
    const onOpenChange=(chambre:Chambre)=>{
            setSelectedChambre(chambre)
        setOpenChange(true)
    }
  return (
    <>
      {hotel.chambres.map((ch, index) => (
        <div key={ch.id} className="overflow-hidden duration-300">
          <div
            className="relative h-52 w-full overflow-hidden"
            onMouseEnter={() => setHoveredCarousel(index)}
            onMouseLeave={() => setHoveredCarousel(null)}
          >
            <Carousel className="w-full h-full">
              <CarouselContent className="w-full h-52">
                {ch?.images?.map((image, imgIndex) => (
                  <CarouselItem key={imgIndex} className="relative w-full h-52">
                    <div className="relative w-full h-52">
                      <Image
                        alt={`Image ${imgIndex + 1}`}
                        src={image.urlImage}
                        fill
                        priority={imgIndex === 0}
                        className="object-cover transition-transform duration-200 hover:scale-105 rounded-xl cursor-pointer"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={80}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {hoveredCarousel === index && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 items-center justify-center bg-black/50 text-white rounded-full transition-opacity duration-300" />
                  <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 items-center justify-center bg-black/50 text-white rounded-full transition-opacity duration-300" />
                </>
              )}
            </Carousel>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-center my-3">
            <span className="font-bold text-lg text-gray-800">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF' }).format(ch.price)}
            </span>
            <span className={`flex items-center gap-1 ${ch.disponible ? 'text-green-600' : 'text-red-500'}`}>
              {ch.disponible ? <CheckCircle size={20} /> : <XCircle size={20} />}
              {ch.disponible ? 'Disponible' : 'Occupée'}
            </span>
          </div>
          <div className="flex flex-col">
            <span>Capacité: {ch.capacity}</span>
            <span>Type Chambres: {ch.type}</span>
          </div>
          <div className="grid grid-cols-1 my-3 space-y-4">
            {ch.hasClim && (
              <div className="group flex items-center gap-4 rounded-xl   transition-all duration-300 cursor-pointer">
                <Wifi className="w-4 h-4 text-blue-500" /> Wi-Fi gratuit
              </div>
            )}
            {ch.hasTV && (
              <div className="group flex items-center gap-4 rounded-xl  transition-all duration-300 cursor-pointer">
                <Tv2 className="w-4 h-4 text-gray-600" /> Télévision incluse
              </div>
            )}
            {ch.hasKitchen && (
              <div className="group flex items-center gap-4 rounded-xl transition-all duration-300 cursor-pointer">
                <Utensils className="w-4 h-4 text-green-500" /> Cuisine équipée
              </div>
            )}
            {ch.extraBed && (
              <div className="group w-full flex items-center gap-4 rounded-xl transition-all duration-300 cursor-pointer">
                <Bed className="w-4 h-4 text-purple-500" /> Lit supplémentaire
              </div>
            )}
          </div>
          <button className="bg-green-800 p-2 rounded-lg text-white w-10/12 lg:w-full hover:bg-green-600 hover:transition-all" onClick={() => onOpenChange(ch)}
          >Reserver</button>
         <div>
      
       
         </div>
        </div>
      
      ))}
   
        <CardReservationHotel 
          open={open} 
          onOpenChange={setOpenChange}
          chambre={selectedChambre}
        />
    <div className="flex justify-between mt-5">

</div>
      
    </>
    

     
  );

}