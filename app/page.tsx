// @ts-nocheck
import CountUp from "./components/countUp";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Emploi Centrafrique : Offres ONG et entreprises | TeneTiKwa",
  description:
    "Plateforme d'emploi en Centrafrique. Trouvez des offres d'ONG, entreprises et organisations internationales à Bangui et partout dans le pays.",
  keywords: [
    "emploi Centrafrique",
    "offres ONG Bangui",
    "travail RCA",
    "recrutement Centrafrique",
    "emploi Bangui",
  ],

  alternates: {
    canonical: "https://tenetikwa.vercel.app",
  },

  openGraph: {
    title: "TeneTiKwa - Emploi en Centrafrique",
    description:
      "Offres d'emploi ONG et entreprises en Centrafrique",
    url: "https://tenetikwa.vercel.app",
    siteName: "TeneTiKwa",
    images: [{ url: "/icones.png", width: 1200, height: 630 }],
    locale: "fr_FR",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },

  twitter: {
    card: "summary_large_image",
    title: "TeneTiKwa",
    description: "Emploi en Centrafrique",
    images: ["/icones.png"],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "JobBoard",
  name: "TeneTiKwa",
  url: "https://tenetikwa.vercel.app",
  description: "Plateforme d'emploi en Centrafrique",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-20">

      {/* HEADER */}
      <header className="w-full border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-4 gap-4">

          <Image
            src="/icones.png"
            alt="TeneTiKwa logo emploi Centrafrique"
            width={110}
            height={110}
            priority
          />

          <p className="text-gray-600 text-sm sm:text-base text-center max-w-md">
            Plateforme d'emploi en Centrafrique : ONG, entreprises et organisations internationales
          </p>

          <Link
            href="/auth/login"
            className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            Connexion
          </Link>
        </div>
      </header>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* HERO */}
      <main className="flex-1 flex items-center justify-center relative">

        {/* background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-emerald-200/30 blur-3xl rounded-full top-10 left-10"></div>
          <div className="absolute w-[400px] h-[400px] bg-sky-200/30 blur-3xl rounded-full bottom-10 right-10"></div>
        </div>

        <div className="max-w-6xl w-full px-4 py-12 relative z-10">

          <div className="bg-white/80 backdrop-blur-md border shadow-xl rounded-3xl p-8 sm:p-12 text-center">

            <Image
              src="/icones.png"
              alt="emploi Centrafrique TeneTiKwa"
              width={180}
              height={180}
              className="mx-auto mb-6"
              priority
            />

            {/* H1 SEO */}
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">
              Trouvez un emploi en Centrafrique rapidement
            </h1>

            <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
              Accédez aux offres d'emploi des ONG, entreprises et institutions à Bangui et dans toute la Centrafrique.
            </p>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">

              <div>
                <p className="text-4xl font-bold text-emerald-600">
                  +<CountUp end={150} />
                </p>
                <p className="text-gray-500">Offres mensuelles</p>
              </div>

              <div>
                <p className="text-4xl font-bold text-sky-600">
                  +<CountUp end={30} />
                </p>
                <p className="text-gray-500">Entreprises actives</p>
              </div>

              <div>
                <p className="text-4xl font-bold text-black">
                  +<CountUp end={100} />
                </p>
                <p className="text-gray-500">100% gratuit</p>
              </div>

            </div>

            {/* SEO SECTION */}
            <section className="mt-14 text-left max-w-4xl mx-auto">

              <h2 className="text-2xl font-bold mb-4">
                Plateforme d'emploi en Centrafrique
              </h2>

              <p className="text-gray-600 leading-8 mb-4">
                TeneTiKwa centralise les offres d'emploi disponibles en Centrafrique pour les ONG, entreprises privées et organisations internationales.
              </p>

              <p className="text-gray-600 leading-8">
                Que vous soyez développeur, comptable, logisticien ou étudiant, trouvez rapidement des opportunités professionnelles adaptées à votre profil.
              </p>
            </section>

            {/* WHY */}
            <section className="mt-10 text-left max-w-4xl mx-auto">

              <h2 className="text-2xl font-bold mb-4">
                Pourquoi utiliser TeneTiKwa ?
              </h2>

              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Offres vérifiées et mises à jour</li>
                <li>Accès rapide aux emplois ONG et entreprises</li>
                <li>Disponible partout en Centrafrique</li>
                <li>Interface simple et rapide</li>
              </ul>
            </section>

            {/* CTA */}
            <div className="mt-12">
              <Link
                href="/auth"
                className="inline-block bg-emerald-600 text-white px-10 py-3 rounded-full text-lg hover:bg-emerald-700 transition shadow-lg hover:scale-105"
              >
                Voir les offres d'emploi
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t bg-white py-6 mt-10">
        <div className="text-center text-gray-500 text-sm">
          © 2026 TeneTiKwa - Tous droits réservés
        </div>
      </footer>

    </div>
  );
}