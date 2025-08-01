import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { CommentProvider } from "@/contexte/CommenteContexte";
import { CommentHotelProvider } from "@/contexte/userCommentHotelContext";
import { FilterProvider } from "@/contexte/FilterContexte";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata:Metadata = {
  title: "Kims Hotel",
  description: "Application de réservation d'hôtel en Guinée",
  verification: {
    google: "_l9ejk4gq4RUP30Z65C0z_r73lbwWIVC26EDgZ6dIuE",
  },
  icons: {
    icon: '/logoBlanc.png',
  },
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover"
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
          <CommentProvider>
            <CommentHotelProvider>
              <FilterProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
                <Toaster />
              </ThemeProvider>
              </FilterProvider>
            
            </CommentHotelProvider>
          </CommentProvider>
       
      </body>
    </html>
  );
}

