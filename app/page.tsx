import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* HEADER */}
      <header className="flex items-center justify-between p-4 border-b">
        <Image
          src="/icones.png"
          alt="logo"
          width={150}
          height={150}
          className="mb-6"
        />
        <p className="text-gray-600 max-w-xl mb-8">
          Décrochez l'emploi qui vous correspond, où que vous soyez en Centrafrique
        </p>
        <Link href="/auth/login" className="bg-black text-orange-500 px-4 py-2 rounded">
          Connexion
        </Link>
      </header>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4">

        {/* LOGO CENTRE */}
        <Image
          src="/icones.png"
          alt="logo"
          width={510}
          height={510}
          className="mb-6"
        />

        <h1 className="text-4xl font-bold mb-4">
          Trouvez votre futur job en quelques clics
        </h1>

        <p className="text-gray-600 max-w-xl mb-8">
          Toutes les offres d’emploi des ONG et entreprises réunies en un seul endroit.
        </p>

        {/* INDICATEUR DYNAMIQUE */}
        <div className="mb-8">
          <p className="text-sky-500 text-5xl md:text-6xl font-extrabold">
            +150
          </p>
          <p className="text-sky-600 text-lg font-medium">
            offres publiées ce mois
          </p>
        </div>

        <Link
          href="/auth"
          className="bg-green-600 text-white px-6 py-3 rounded-full text-lg hover:bg-green-700 transition"
        >
          Commencer
        </Link>

      </section>

    {/* FOOTER SIMPLE */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2026 GreenItCar - Tous droits réservés
        </div>
      </footer>
    </main>
  );
}