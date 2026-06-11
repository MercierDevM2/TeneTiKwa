import Connexion from './connexion.js';


export const metadata = {
  title: "Connexion | TeneTiKwa",
  description:
    "Connectez-vous à votre espace TeneTiKwa pour consulter vos candidatures et découvrir de nouvelles offres d'emploi.",
  alternates: {
    canonical: "https://tenetikwa.vercel.app/connexion",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return <Connexion />;
}
