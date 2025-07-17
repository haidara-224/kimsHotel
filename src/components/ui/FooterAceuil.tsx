import Link from "next/link";
import { Separator } from "./separator";
import { Heart, CalendarCheck, Lock, Hotel, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";
import Image from "next/image";

export function Footers() {
  return (
    <footer className="bg-white dark:bg-slate-900 py-12 px-4 md:px-8 border-t border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <Image
                src="/logoSimple.png"
                width={120}
                height={120}
                alt="Kims Hotel"
                className="w-24 h-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Votre plateforme de réservation d&apos;hôtels et appartements premium en Guinée.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook className="w-5 h-5" />, name: "facebook" },
                { icon: <Twitter className="w-5 h-5" />, name: "twitter" },
                { icon: <Instagram className="w-5 h-5" />, name: "instagram" },
              ].map((social) => (
                <Link 
                  key={social.name}
                  href={`https://${social.name}.com`}
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  aria-label={social.name}
                >
                  <div className="w-9 h-9 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                    {social.icon}
                  </div>
                </Link>
              ))}
            </div>
          </div>

       
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Liens rapides</h3>
            <nav className="space-y-3">
              {[
                { href: "/favorites", icon: Heart, label: "Mes Favoris" },
                { href: "/reservations", icon: CalendarCheck, label: "Mes Réservations" },
                { href: "/type-etablissement", icon: Hotel, label: "Ajouter Mon Établissement" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors group"
                >
                  <item.icon className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
       
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informations</h3>
            <nav className="space-y-3">
              {[
                { href: "/confidentialite", icon: Lock, label: "Confidentialité" },
                { href: "/cgv", icon: Lock, label: "CGV" },
                { href: "/mentions-legales", icon: Lock, label: "Mentions légales" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors group"
                >
                  <item.icon className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

         
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contactez-nous</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 mt-1 text-blue-500 dark:text-blue-400" />
                <span>Conakry, Guinée</span>
              </div>
              <Link href="tel:+224000000000" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <Phone className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <span>+224 000 00 00 00</span>
              </Link>
              <Link href="mailto:contact@kimshotel.net" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <span>contact@kimshotel.net</span>
              </Link>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-slate-700" />

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            © {new Date().getFullYear()} Kims Engineering. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link href="/" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
              Conditions d&apos;utilisation
            </Link>
            <Link href="/" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
              Politique de cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}