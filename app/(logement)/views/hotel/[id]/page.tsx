'use client';

import { getDetailsHotel } from "@/app/(action)/hotel.action";
import Gallery from "@/src/components/ui/Client/GalleryHotel";
import { NavBar } from "@/src/components/ui/NavBar";
import { Hotel } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function Page() {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setisLoading] = useState(false)

  const params = useParams();
  const hotelId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  useEffect(() => {
    const getHotel = async () => {
      try {
        setisLoading(true)
        const data = await getDetailsHotel(hotelId) as unknown as Hotel;
        setHotel(data);

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
      <NavBar />
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center  bg-opacity-50">
          <span className="loaderCharge"></span>
        </div>
      )}
      <div className="container mx-auto px-5 lg:px-16 mt-5">
        {
          hotel && (
            <div>
              <Gallery hotel={hotel} />
              <div className="mt-5 font-bold text-xl">
                Cet hôtel {hotel.etoils}-étoiles vous offre un séjour d&apos;exception avec des services de qualité.
              </div>
              <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-1 mt-5">
                <p className="lg:mt-1"><span className="font-bold">Ville:</span> {hotel?.ville}</p>
                <p><span className="font-bold">Adresse:</span> {hotel?.adresse}</p>
                <p><span className="font-bold">Telephone:</span> {hotel?.telephone}</p>
                <p><span className="font-bold">Email:</span> {hotel?.email}</p>
              </div>
            </div>


          )


        }
      </div>

    </>
  );
}
