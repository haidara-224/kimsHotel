"use client"

import UserHotelDataTable from "@/src/components/ui/Dashboard/UserHotelDataUserTable";

import { useParams } from "next/navigation";
export default function Page(){
     const params = useParams();
                const hotelId = Array.isArray(params.hotelId) ? params.hotelId[0] : params.hotelId || "";
    return (         
        <>
        <UserHotelDataTable hotel={hotelId} />
        </>
    )
}