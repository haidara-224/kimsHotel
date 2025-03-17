'use client';

import { getDetailsHotel } from "@/app/(action)/hotel.action";
import Gallery from "@/src/components/ui/Client/GalleryHotel";


import { NavBar } from "@/src/components/ui/NavBar";
import { Hotel } from "@/types/types";




import { useParams } from "next/navigation";
import { useEffect, useState } from "react";




export default function Page() {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  

  const params = useParams();
  const hotelId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  useEffect(() => {
    const getHotel = async () => {
      const data = await getDetailsHotel(hotelId) as unknown as Hotel;
      setHotel(data);
    };
    getHotel();
  }, [hotelId]);

  

  return (
    <>
      <NavBar />
      {hotel && <Gallery hotel={hotel} />}
    </>
  );
}
