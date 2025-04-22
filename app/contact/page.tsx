import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { NavBar } from "@/src/components/ui/NavBar";
import { Textarea } from "@/src/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { Metadata } from "next";
export const metadata:Metadata = {
    title: "Contact",
    description: "Kims Hotel- Nous Contacter",
    verification: {
      google: "_l9ejk4gq4RUP30Z65C0z_r73lbwWIVC26EDgZ6dIuE",
    },
    icons: {
      icon: '/logoBlanc.png',
    },
  };
export default function Page() {
  return (
    <div className="w-full min-h-screen bg-background">
  
      <nav className="bg-white shadow-md fixed top-0 w-full z-40 p-2 lg:p-5">
        <NavBar />
      </nav>

  
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-10">
            Contactez-nous
          </h1>

          <div className="grid md:grid-cols-2 gap-10">
        
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-teal-600" />
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-white">Email</h4>
                  <p className="text-gray-500 dark:text-gray-300">support@kimshotel.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-teal-600" />
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-white">Téléphone</h4>
                  <p className="text-gray-500 dark:text-gray-300">+224 627 55 29 43</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-teal-600" />
                <div>
                  <h4 className="font-semibold text-gray-700 dark:text-white">Adresse</h4>
                  <p className="text-gray-500 dark:text-gray-300">Conakry, Guinée</p>
                </div>
              </div>
            </div>

         
            <form className="space-y-6">
              <Input placeholder="Votre nom" required />
              <Input type="email" placeholder="Votre adresse e-mail" required />
              <Textarea placeholder="Votre message..." rows={5} required />
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Envoyer le message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
