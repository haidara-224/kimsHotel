import { Button } from "./button";

export function ContactUs(){
    return (
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-3">
          Vous recherchez une expérience ?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Nous vous offrons des moments inoubliables, conçus pour répondre à vos attentes les plus élevées.
          </p>
          <Button className="bg-teal-600 hover:bg-teal-700">Contactez Nous</Button>
        </div>
    )
}