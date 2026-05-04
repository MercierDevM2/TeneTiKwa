import { Suspense } from "react";
import DashboardPage from "./tableau";

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DashboardPage />
    </Suspense>
  );
}