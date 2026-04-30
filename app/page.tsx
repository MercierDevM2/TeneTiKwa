import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white pb-20">

      {/* HEADER (inchangé sauf micro amélioration) */}
      <header className="w-full border-b bg-white/80 backdrop-blur-md">
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
            className="bg-black text-orange-500 px-4 py-2 rounded-md w-full sm:w-auto hover:bg-gray-900 transition"
          >
            Connexion
          </Link>

        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center relative">

        {/* fond décoratif léger (IMPORTANT pour le design) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[400px] h-[400px] bg-green-200/30 blur-3xl rounded-full top-10 left-10"></div>
          <div className="absolute w-[300px] h-[300px] bg-sky-200/30 blur-3xl rounded-full bottom-10 right-10"></div>
        </div>

        <div className="max-w-6xl w-full flex flex-col items-center text-center px-4 py-10 sm:py-16 lg:py-20 relative z-10">

          {/* HERO CARD */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 sm:p-12 border border-gray-100">

            {/* LOGO */}
            <Image
              src="/icones.png"
              alt="logo"
              width={200}
              height={200}
              className="w-32 sm:w-44 md:w-56 mx-auto mb-6"
            />

            {/* TITRE */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">
              Votre prochain emploi commence ici
            </h1>

            {/* DESCRIPTION */}
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8">
              Accédez aux meilleures offres d'emploi des ONG et entreprises en un seul endroit.
            </p>

            {/* STATS MULTIPLES */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-6">

              <div className="text-center">
                <p className="text-sky-600 text-4xl font-bold">+150</p>
                <p className="text-gray-500 text-sm">offres/mois</p>
              </div>

              <div className="text-center">
                <p className="text-green-600 text-4xl font-bold">+30</p>
                <p className="text-gray-500 text-sm">entreprises</p>
              </div>

              <div className="text-center">
                <p className="text-black text-4xl font-bold">100%</p>
                <p className="text-gray-500 text-sm">gratuit</p>
              </div>

            </div>

            {/* BENEFICES */}
            <p className="text-gray-500 text-sm mb-6">
              ✔ Rapide & simple &nbsp; ✔ Offres vérifiées &nbsp; ✔ Accessible partout
            </p>

            {/* CTA */}
            <Link
              href="/auth"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full text-lg hover:bg-green-700 transition shadow-md hover:shadow-xl transform hover:scale-105"
            >
              Voir les offres
            </Link>

          </div>
        </div>
      </main>

      {/* FOOTER (inchangé) */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t py-6 z-50">
        <div className="text-center text-gray-500 text-sm">
          © 2026 GreenItCar tous droits réservés.
        </div>
      </footer>

    </div>
  );
}