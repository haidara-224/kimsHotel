'use client';
import { getDetailsHotel } from "@/app/(action)/hotel.action";
import AvisCommentHotel from "@/src/components/ui/Client/AvisCommentHotel";
import Gallery from "@/src/components/ui/Client/GalleryHotel";
import { HotelChambre } from "@/src/components/ui/Client/HotelChambre";
import { HotelComment } from "@/src/components/ui/Client/HotelComment";
import Loader from "@/src/components/ui/Client/Loader";
import { OptionHotel } from "@/src/components/ui/Client/OptionHotel";
import { NavBar } from "@/src/components/ui/NavBar";
import { Hotele } from "@/types/types";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
export default function Page() {
  const [hotel, setHotel] = useState<Hotele | null>(null);
  const [isLoading, setisLoading] = useState(false)


  const [dateAnnes, setDateAnne] = React.useState<number>()
  const params = useParams();
  const hotelId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  useEffect(() => {
    const getHotel = async () => {
      try {
        setisLoading(true)
        const data = await getDetailsHotel(hotelId) as unknown as Hotele;

        setHotel(data);
        if (data.createdAt) {
          const createdYear = new Date(data.createdAt).getFullYear();
          const currentYear = new Date().getFullYear();
          const yearsDifference = currentYear - createdYear;

          setDateAnne(yearsDifference);
        }

      } catch (error) {
        console.error(error)
      } finally {
        setisLoading(false)
      }

    };
    getHotel();
  }, [hotelId]);



  return (
    <>
     <div className="w-full min-h-screen bg-background">
     <nav className="bg-white shadow-md  z-40 p-2 lg:p-5">
            <NavBar />
          </nav>
      {isLoading && (
         <Loader/>
      )}
      <div className="container mx-auto px-5 lg:px-16 mt-5">
        {
          hotel && (
            <div>
              <Gallery hotel={hotel} />
              <div className="mt-5 font-bold text-xl">
                Cet hôtel {hotel.etoils}-étoiles vous offre un séjour d&apos;exception avec des services de qualité.
                <div className="flex gap-5 mt-5">
                  <p className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500" /> {hotel.avis?.length} Avis
                  </p>
                  <p className="flex items-center gap-1">
                    <Heart className="w-5 h-5 text-red-500" /> {hotel.favorites?.length} Favoris
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 ">
                <Image
                  src={hotel.user?.profileImage ?? '/user_default.jpg'}
                  alt={`${hotel.user.nom}`}
                  className="w-14 h-14 rounded-full object-cover"
                  width={56}
                  height={56}
                />
                <div>
                  <p className="text-lg font-semibold">Hôte : {hotel.user.nom} {hotel.user.prenom}</p>
                  <p className="text-sm text-gray-500">Membre depuis {dateAnnes} ans</p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-1 mt-5">
                <p className="lg:mt-1"><span className="font-bold">Ville:</span> {hotel?.ville}</p>
                <p><span className="font-bold">Adresse:</span> {hotel?.adresse}</p>
                <p><span className="font-bold">Telephone:</span> {hotel?.telephone}</p>
                <p><span className="font-bold">Email:</span> {hotel?.email}</p>
              </div>
              <section className="rounded-lg mt-5 flex flex-col lg:flex-row justify-between gap-8 relative ">

                <div className="w-full ">
                  <p className="mt-3 text-lg text-foreground/80 py-5 font-medium">
                    <span className=" font-bold">{hotel.nom}</span> vous offre un cadre exceptionnel avec ⭐
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <OptionHotel hotel={hotel} />
                  </div>
                  <h1 className="mt-3 font-bold">Nos Chambres</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mt-5">
                    <HotelChambre hotel={hotel} />
                  </div>
                </div>

              </section>
              <section>
             <AvisCommentHotel hotelId={hotel.id} />
             <HotelComment hotelId={hotel.id}/>
              </section>
            </div>


          )


        }
      </div>
     </div>
    

    </>
  );
}
