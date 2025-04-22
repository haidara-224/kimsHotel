
import { NavBar } from "@/src/components/ui/NavBar";

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-background">
      <nav className="bg-white shadow-md fixed w-full z-40 p-2 lg:p-5">
        <NavBar />
      </nav>
      <div className="max-w-4xl mx-auto px-15 py-32 text-gray-800 dark:text-white">
        <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">1. Informations que nous collectons</h2>
          <p className="mb-2">Lorsque vous utilisez notre application, nous pouvons collecter les informations suivantes :</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Nom, adresse e-mail, numéro de téléphone</li>
            <li>Localisation (si autorisée)</li>
            <li>Données d’utilisation (pages vues, clics...)</li>
            <li>Détails de vos réservations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">2. Utilisation des informations</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Fournir les services de réservation</li>
            <li>Améliorer l’expérience utilisateur</li>
            <li>Envoyer des notifications importantes</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">3. Partage des données</h2>
          <p>Nous ne vendons jamais vos données. Elles peuvent être partagées uniquement avec :</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Nos partenaires hôteliers</li>
            <li>Nos prestataires techniques (hébergement, email, etc.)</li>
            <li>Les autorités si la loi l’exige</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">4. Sécurité des données</h2>
          <p>Vos données sont protégées par des mesures de sécurité robustes (techniques et organisationnelles).</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">5. Vos droits</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Accéder, modifier ou supprimer vos données</li>
            <li>Retirer votre consentement</li>
            <li>Demander la portabilité</li>
          </ul>
          <p className="mt-2">Contact : <a href="mailto:support@kimshotel.com" className="text-cyan-600 underline">support@kimshotel.com</a></p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">6. Cookies</h2>
          <p>Nous utilisons des cookies pour améliorer la navigation. Vous pouvez les désactiver dans les paramètres de votre appareil.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">7. Modifications</h2>
          <p>Nous nous réservons le droit de modifier cette politique. La date de mise à jour reflète les dernières modifications.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
          <p>Pour toute question, contactez-nous à : <a href="mailto:support@kimshotel.com" className="text-cyan-600 underline">support@kimshotel.com</a></p>
        </section>
      </div>
     
    </div>

  );
}
