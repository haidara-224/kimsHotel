import Link from "next/link";
import { Separator } from "./separator";
import { useUser } from "@clerk/nextjs";
import { Heart, Home, CalendarCheck, Lock, Contact, Hotel } from "lucide-react";
import Image from "next/image";

export function Footers() {
  const { user } = useUser();
  return (
    <footer className="bg-blue-100 py-8 px-4 md:px-8 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          {/* Logo */}
          <Link href="/" className="block group">
            <Image
              src="/logoSimple.png"
              width={100}
              height={100}
              alt="Kims Hotel"
              className="w-20 h-auto transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3"
            />
          </Link>

          {/* Liens centraux */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-center">
            <Link
              href={`/dashboard/hotes/${user?.id || ''}`}
              className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
            >
              <Home className="w-5 h-5" /> Mes Annonces
            </Link>
            <Link
              href="/favorites"
              className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
            >
              <Heart className="w-5 h-5" /> Mes Favoris
            </Link>
            <Link
              href="/"
              className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" /> Mes Réservations
            </Link>
            <Link
              href="/type-etablissement"
              className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
            >
              <Hotel className="w-5 h-5" />  Ajouter Mon Etablissement
            </Link>
          </div>

          {/* Liens à droite */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-center">
            <Link
              href="/confidentialite"
              className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
            >
              <Lock className="w-5 h-5" /> Confidentialité
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
            >
              <Contact className="w-5 h-5" /> Contact
            </Link>
          </div>
        </div>

        <Separator className="bg-teal-700" />

        <div className="pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Kims Engineering. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
