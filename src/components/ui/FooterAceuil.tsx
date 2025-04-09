import Link from "next/link";
import { Separator } from "./separator";

export function Footers() {
  return (
    <footer className="bg-blue-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">

            <span className="text-2xl font-bold italic">Kims Hotel</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">Mes Annonces</Link>
            <Link href="/favorites" className="text-gray-600 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">Mes Favoris</Link>
            <Link href="/" className="text-gray-600 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium">Mes Reservations</Link>

          </div>
        </div>
        <Separator />
        <div className="pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} kims Engineering. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}