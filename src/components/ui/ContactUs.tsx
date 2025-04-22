"use client"
import { Button } from "./button";
import { useRouter } from "next/navigation";

export function ContactUs() {
  const router = useRouter();

  const contact = () => {
    router.push("/contact");
  };

  return (
    <div className="text-center px-4 py-12">
      <h2 className="text-3xl font-semibold mb-3 text-gray-800 dark:text-white">
        Vous recherchez une expérience ?
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
        Nous vous offrons des moments inoubliables, conçus pour répondre à vos attentes les plus élevées.
      </p>
      <Button onClick={contact} className="bg-teal-600 hover:bg-teal-700 text-white">
        Contactez-nous
      </Button>
    </div>
  );
}
