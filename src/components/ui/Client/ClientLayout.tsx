"use client";

import { useState } from "react";
import { Menu, X, Hotel, House } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../ThemeToggler";
import Image from "next/image";

export default function ClientLayouts({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

  const navItems = [
    { icon: Hotel, label: "Hotels", href: `/dashboard/hotes/${user?.id}/hotels` },
    { icon: House, label: "Appartements", href: `/dashboard/hotes/${user?.id}/appartements` },

  ];

  return (
    <div className="flex min-h-screen bg-background">
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b">
        <Link href="/" className="block group">
          <Image
            src="/logoSimple.png"
            width={100}
            height={100}
            alt="Kims Hotel"
            className="w-20 h-auto transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3"
          />
        </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Topbar */}
      <div className="fixed top-0 left-0 bottom- w-full z-30 flex items-center justify-between bg-white border-b p-4 shadow-sm">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <ModeToggle />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:ml-0 mt-16 lg:mt-20 w-full">
        {children}
      </main>
    </div>
  );
}
