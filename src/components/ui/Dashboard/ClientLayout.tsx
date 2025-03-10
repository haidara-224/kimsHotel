"use client"; 
import { NavBar } from "@/src/components/ui/Dashboard/NavBar";

import { SidebarProvider, SidebarTrigger } from "../sidebar";
import { SideBars } from "./SideBar";
export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <NavBar/>
            <SidebarProvider>
            
            <SideBars />
            <main  className="p-5 w-full md:max-w[1140px]">
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>

        </div>
       
  
             
       
    );
}
