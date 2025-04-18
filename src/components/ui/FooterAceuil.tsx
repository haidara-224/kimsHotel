import Link from "next/link";
import { Separator } from "./separator";
import { useUser } from "@clerk/nextjs";
import { Heart, Home, CalendarCheck } from "lucide-react";
import Image from "next/image";
export function Footers() {
  const { user } = useUser()
  return (
    <footer className="bg-blue-100 py-8 px-4 md:px-8 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">

          <Link href="/" className="block">
                                <Image
                                    src="/logoSimple.png"
                                    width={100}
                                    height={100}
                                    alt="Kims Hotel"
                                    className="w-16 h-auto sm:w-16 md:w-16 lg:w-24 xl:w-24"
                                />
                            </Link>
          </div>


          <div className="flex gap-6">
            <Link
              href={`/dashboard/hotes/${user?.id || ''}`}
              className="text-gray-600 hover:text-teal-600  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
            >
              <Home className="w-5 h-5" /> Mes Annonces
            </Link>
            <Link
              href="/favorites"
              className="text-gray-600 hover:text-teal-600  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
            >
              <Heart className="w-5 h-5" /> Mes Favoris
            </Link>
            <Link
              href="/"
              className="text-gray-600 hover:text-teal-600  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" /> Mes Réservations
            </Link>
          </div>

        </div>
        <Separator className="bg-teal-700" />
        <div className="pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} kims Engineering. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}