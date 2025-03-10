'use client'
import {  getCountHotel, getCountLogement,getCountUser } from "@/app/(action)/dashboard.action";
import { DashboardCard } from "@/src/components/ui/Dashboard/DashboardCard";
import { Hotel, Users, Home } from "lucide-react";
import { useEffect, useState } from "react";
export function CountDashboard(){
    const [countLogement, setCountLogement] = useState<number>(0);
    const [countHotel, setCountHotel] = useState<number>(0);
    const [countUser,setCountUser]=useState<number>(0)
    
    async function fetchData() {
        try {
            const [cnl, cnr,cnu] = await Promise.all([
                getCountLogement(),
                getCountHotel(),
                getCountUser(),
                
            ]);
            setCountLogement(cnl);
            setCountHotel(cnr);
            setCountUser(cnu)
           
        } catch (e) {
            console.error("Erreur lors du chargement des données:", e);
        }
    }
    useEffect(() => {
   
        fetchData();
    }, []);

    return (
        <>
        <DashboardCard 
                title="Logements" 
                count={countLogement} 
                icon={<Home className="text-slate-500" size={40} />} 
            />
            <DashboardCard 
                title="Hôtels" 
                count={countHotel} 
                icon={<Hotel className="text-slate-500" size={40} />} 
            />
            <DashboardCard 
                title="Utilisateurs" 
                count={countUser} 
                icon={<Users className="text-slate-500" size={40} />} 
            />
            

        </>
    )
}