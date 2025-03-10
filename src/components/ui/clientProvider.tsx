"use client"; 

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/src/components/ui/providers/ThemeProvider";
import { Toaster } from "@/src/components/ui/toaster";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    </ClerkProvider>
  );
}
