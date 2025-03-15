"use client"; 
import { NavBar } from "@/src/components/ui/Dashboard/NavBar";

import { SidebarProvider, SidebarTrigger } from "../sidebar";
import { SideBarsClient } from "./SideBars";



export default function ClientLayouts({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <NavBar/>
            <SidebarProvider>
            
            <SideBarsClient/>
            <main  className="p-5 w-full md:max-w[1140px]">
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>

        </div>
       
  
             
       
    );
}
