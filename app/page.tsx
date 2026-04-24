import Image from "next/image";
import Link from "next/link";

export default function Home() {
 return (
  <div className="min-h-screen flex flex-col bg-gray-50 pb-20">

    {/* HEADER */}
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        
        <Image
          src="/icones.png"
          alt="logo"
          width={120}
          height={120}
          className="w-24 sm:w-28 md:w-32"
        />

        <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left max-w-md">
          Décrochez l'emploi qui vous correspond, où que vous soyez en Centrafrique
        </p>

        <Link
          href="/auth/login"
          className="bg-black text-orange-500 px-4 py-2 rounded-md text-center w-full sm:w-auto hover:bg-gray-900 transition"
        >
          Connexion
        </Link>
      </div>
    </header>

    {/* MAIN */}
    <main className="flex-1 flex items-center justify-center">
      <div className="max-w-6xl w-full flex flex-col items-center text-center px-4 py-10 sm:py-16 lg:py-20">

        {/* LOGO */}
        <Image
          src="/icones.png"
          alt="logo"
          width={250}
          height={250}
          className="w-36 sm:w-52 md:w-64 lg:w-72 mb-6"
        />

        {/* TITRE */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
          Trouvez votre futur job en quelques clics
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mb-8">
          Toutes les offres d'emploi des ONG et entreprises réunies en un seul endroit.
        </p>

        {/* STATS */}
        <div className="mb-8">
          <p className="text-sky-500 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
            +150
          </p>
          <p className="text-sky-600 text-sm sm:text-base md:text-lg font-medium">
            offres publiées ce mois
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/auth"
          className="bg-green-600 text-white px-6 py-3 rounded-full text-base sm:text-lg hover:bg-green-700 transition w-full sm:w-auto"
        >
          Commencer
        </Link>

      </div>
    </main>

    {/* FOOTER */}
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t py-6 z-50">
        <div className="text-center text-gray-500 text-sm">
        © 2026 GreenItCar tous droits réservés.
      </div>
    </footer>
  </div>
);
}
