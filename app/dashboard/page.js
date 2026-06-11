import { Suspense } from "react";
import DashboardPage from "./tableau";

export const metadata = {
  title: "Tableau de bord | TeneTiKwa",
  description:
    "Gérez votre profil, vos candidatures et vos alertes emploi depuis votre espace personnel TeneTiKwa.",
  alternates: {
    canonical: "https://tenetikwa.vercel.app/dashboard",
  },
  robots: {
    index: false,
    follow: false,
  },
};
export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DashboardPage />
    </Suspense>
  );
}