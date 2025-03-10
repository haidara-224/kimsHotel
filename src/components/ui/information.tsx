'use client'
import { useUser } from "@clerk/nextjs";

export function Information(){
    const {user}=useUser()
const img= user?.imageUrl
    return (
        <div>
        <img src={img} alt="" />
    </div>
    )
}