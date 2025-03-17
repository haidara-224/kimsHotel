'use client';

import { getDetailsHotel } from "@/app/(action)/hotel.action";
import Gallery from "@/src/components/ui/Client/GalleryHotel";


import { NavBar } from "@/src/components/ui/NavBar";
import { Hotel } from "@/types/types";




import { useParams } from "next/navigation";
import { useEffect, useState } from "react";




export default function Page() {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading,setisLoading]=useState(false)

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
      }finally{
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
      {hotel && <Gallery hotel={hotel} />}
    </>
  );
}
