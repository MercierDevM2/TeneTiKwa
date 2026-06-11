import Inscrire from './login/inscription.js';

export const metadata = {
  title: "Inscription | TeneTiKwa - Créez votre compte",
  description:
    "Inscrivez-vous sur TeneTiKwa pour postuler aux offres d'emploi en Centrafrique et recevoir les dernières opportunités.",
  alternates: {
    canonical: "https://tenetikwa.vercel.app/inscription",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Inscription | TeneTiKwa",
    description: "Créez votre compte et accédez aux offres d'emploi en Centrafrique.",
    url: "https://tenetikwa.vercel.app/inscription",
    siteName: "TeneTiKwa",
    images: [{ url: "/icones.png", width: 1200, height: 630 }],
    type: "website",
    locale: "fr_FR",
  },
};
export default function Page() {
  return <Inscrire />;
}
