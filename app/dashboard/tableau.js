"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [filters, setFilters] = useState({ poste: "", lieu: "" });
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);

  const [user, setUser] = useState({
    name: "Utilisateur",
    email: "",
  });

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // 🔐 SESSION
        const { data: { session }, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.log("Session error:", sessionError.message);
        }

        if (!session) {
          router.replace("/");
          return;
        }

        const currentUser = session.user;

        // 👤 PROFILE
        const { data: profile } = await supabase
          .from("profiles")
          .select("nom")
          .eq("id", currentUser.id)
          .maybeSingle();

        // 📦 JOBS (IMPORTANT: debug complet)
        const { data: jobsData, error: jobsError } = await supabase
          .from("jobs")
          .select("*");

        console.log("JOBS RAW:", jobsData);
        console.log("JOBS ERROR:", jobsError);

        if (!mounted) return;

        setUser({
          name: profile?.nom || currentUser.email?.split("@")[0],
          email: currentUser.email,
        });

        // ⚠️ IMPORTANT: fallback visible même si vide
        setJobs(jobsData ?? []);
        setFilteredJobs(jobsData ?? []);
        setAuthChecked(true);

      } catch (err) {
        console.log("INIT ERROR:", err.message);
        setAuthChecked(true);
      }
    };

    init();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_OUT") {
          router.replace("/");
        }
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 🔍 SEARCH
  const handleSearch = () => {
    let filtered = [...jobs];

    if (filters.poste) {
      filtered = filtered.filter(job =>
        job.titre?.toLowerCase().includes(filters.poste.toLowerCase())
      );
    }

    if (filters.lieu) {
      filtered = filtered.filter(job =>
        job.lieu?.toLowerCase().includes(filters.lieu.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleReset = () => {
    setFilters({ poste: "", lieu: "" });
    setFilteredJobs(jobs);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* HEADER */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">

          <Image src="/icones.png" alt="logo" width={120} height={120} />

          <div className="flex items-center gap-4">

            <Link href="/favoris">❤️</Link>
            <Link href="/notifications">🔔</Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                {user.name?.charAt(0)}
              </div>
              <span className="hidden md:inline">{user.name}</span>
            </div>

            <button onClick={handleLogout} className="text-red-600">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 py-6">

        {/* FILTRES */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="mb-4 font-semibold">Recherche d'emploi</h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              placeholder="Poste"
              value={filters.poste}
              onChange={(e) =>
                setFilters({ ...filters, poste: e.target.value })
              }
              className="border p-2 rounded"
            />

            <input
              placeholder="Lieu"
              value={filters.lieu}
              onChange={(e) =>
                setFilters({ ...filters, lieu: e.target.value })
              }
              className="border p-2 rounded"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                🔍 Rechercher
              </button>

              <button
                onClick={handleReset}
                className="border px-4 py-2 rounded"
              >
                ↺
              </button>
            </div>

          </div>
        </div>

        {/* JOBS */}
        <div className="space-y-4">

          {filteredJobs.length === 0 ? (
            <p className="text-gray-500">Aucune offre disponible</p>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-5 rounded-xl shadow border-l-4 border-green-500"
              >

                <div className="flex justify-between gap-4">

                  <div className="flex-1">

                    <div className="flex items-center gap-3 mb-2">

                      <Image
                        src={job.logo || "/placeholder.png"}
                        alt="logo"
                        width={40}
                        height={40}
                        unoptimized
                      />

                      <div>
                        <h3 className="font-bold text-lg">{job.titre}</h3>
                        <p className="text-sm text-gray-500">
                          {job.entreprise}
                        </p>
                      </div>

                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {job.description}
                    </p>

                    <div className="flex gap-3 text-xs">
                      <span>📍 {job.lieu}</span>
                      <span>💼 {job.type}</span>
                      <span>
                        📅 {job.date
                          ? new Date(job.date).toLocaleDateString("fr-FR")
                          : ""}
                      </span>
                    </div>

                  </div>

                  <Link href={job.lien || "#"} target="_blank">
                    <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
                      Postuler →
                    </button>
                  </Link>

                </div>

              </div>
            ))
          )}

        </div>

      </main>

      <footer className="bg-white border-t mt-auto py-6">
      <div className="text-center text-gray-500 text-sm">
        © 2026 GreenItCar tous droits réservés.
      </div>
    </footer>

    </div>
  );
}