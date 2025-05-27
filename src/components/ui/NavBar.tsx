"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";


import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, Heart, Home, Hotel, LucideIcon } from "lucide-react";

import { UserNav } from "./userNav";
import { ModeToggle } from "./ThemeToggler";
import { signOut, useSession } from "@/src/lib/auth-client";
import { UserButton } from "./UserButton";

export function NavBar() {
  const { data: session, isPending } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = !!session;
  const isUnauthenticated = !session && !isPending;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="block group">
              <Image
                src="/logoSimple.png"
                width={100}
                height={100}
                alt="Kims Hotel"
                className="w-20 h-auto transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3"
              />
            </Link>
          </div>

          {/* Menu principal (desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <AnimatedLink href={`/dashboard/hotes/${session?.user?.id || ""}`} Icon={Home}>
              Mes Annonces
            </AnimatedLink>
            <AnimatedLink href="/favorites" Icon={Heart}>
              Mes Favoris
            </AnimatedLink>
            <AnimatedLink href="/reservations" Icon={CalendarCheck}>
              Mes Réservations
            </AnimatedLink>
            <AnimatedLink href="/type-etablissement" Icon={Hotel}>
              Ajouter Mon Etablissement
            </AnimatedLink>


          </div>

          {/* Options à droite */}
          <div className="hidden md:flex items-center space-x-4">

            {isUnauthenticated && (
              <Link href="/auth/signin" className="w-full text-left">
                Se Connecter
              </Link>
            )}

            {isAuthenticated && (
              <button onClick={() => signOut()} className="w-full text-left">
                Se Déconnecter
              </button>
            )}



            <>



              <UserNav />
              <ModeToggle />
              {
                isAuthenticated && (
                  <UserButton />
                )
              }</>
          </div>

          {/* Burger menu (mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3"
          >
            <AnimatedLink href={`/dashboard/hotes/${session?.user.id || ""}`} Icon={Home}>
              Mes Annonces
            </AnimatedLink>
            <AnimatedLink href="/favorites" Icon={Heart}>
              Mes Favoris
            </AnimatedLink>
            <AnimatedLink href="/reservations" Icon={CalendarCheck}>
              Mes Réservations
            </AnimatedLink>
            <AnimatedLink href="/type-etablissement" Icon={Hotel}>
              Ajouter Mon Etablissement
            </AnimatedLink>

            <div className="flex items-center gap-4 px-3 py-2">


              {isUnauthenticated && (
                <Link href="/auth/signin" className="w-full text-left">
                  Se Connecter
                </Link>
              )}

              {isAuthenticated && (
                <button onClick={() => signOut()} className="w-full text-left">
                  Se Déconnecter
                </button>
              )}



              <UserNav />
              <ModeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .menu-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 1rem;
          font-weight: 500;
          color: #4b5563;
        }
        .menu-item:hover {
          color: #0d9488;
        }
      `}</style>
    </>
  );
}

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  Icon?: LucideIcon;
}

function AnimatedLink({ href, children, Icon }: AnimatedLinkProps) {
  return (
    <Link
      href={href}
      className="relative px-3 py-2 text-gray-600 hover:text-teal-600 text-md font-medium group flex items-center gap-2"
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
      <motion.span className="absolute left-0 bottom-0 h-[2px] w-full bg-teal-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      <motion.span className="absolute right-0 top-0 h-[2px] w-full bg-teal-600 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </Link>
  );
}
