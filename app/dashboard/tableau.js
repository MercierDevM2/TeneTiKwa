"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [filters, setFilters] = useState({ poste: "", lieu: "" });
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "Utilisateur", email: "" });

  const mockJobs = [
    {
      id: 1,
      titre: "Chef de projet humanitaire",
      entreprise: "ACTED",
      lieu: "Bangui",
      type: "CDD",
      date: "2026-04-15",
      description: "Coordination des projets humanitaires en zone rurale.",
      logo: "/logos/acted.png"
    },
    {
      id: 2,
      titre: "Infirmier(ère) en chef",
      entreprise: "Médecins Sans Frontières",
      lieu: "Bouar",
      type: "CDI",
      date: "2026-04-14",
      description: "Supervision des soins médicaux.",
      logo: "/logos/msf.png"
    },
    {
      id: 3,
      titre: "Chauffeur logisticien",
      entreprise: "WFP",
      lieu: "Bambari",
      type: "CDD",
      date: "2026-04-13",
      description: "Transport de matériel humanitaire.",
      logo: "/logos/wfp.png"
    },
  ];

  // 🔐 Auth + data
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("nom")
        .eq("id", user.id)
        .single();

      setUser({
        name: profile?.nom || user.email?.split("@")[0] || "Utilisateur",
        email: user.email,
      });

      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    };

    fetchUser();
  }, []);

  // 🔄 Auth listener
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.push("/auth/login");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔍 Recherche
  const handleSearch = () => {
    let filtered = [...jobs];

    if (filters.poste) {
      filtered = filtered.filter(job =>
        job.titre.toLowerCase().includes(filters.poste.toLowerCase())
      );
    }

    if (filters.lieu) {
      filtered = filtered.filter(job =>
        job.lieu.toLowerCase().includes(filters.lieu.toLowerCase())
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
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">

          <Image src="/icones.png" alt="logo" width={120} height={120} />

          <div className="flex items-center gap-4">
            <Link href="/favoris">❤️</Link>
            <Link href="/notifications">🔔</Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                {user.name.charAt(0)}
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
              onChange={(e) => setFilters({ ...filters, poste: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              placeholder="Lieu"
              value={filters.lieu}
              onChange={(e) => setFilters({ ...filters, lieu: e.target.value })}
              className="border p-2 rounded"
            />

            <div className="flex gap-2">
              <button onClick={handleSearch} className="bg-green-600 text-white px-4 py-2 rounded">
                🔍 Rechercher
              </button>
              <button onClick={handleReset} className="border px-4 py-2 rounded">
                ↺
              </button>
            </div>
          </div>
        </div>

        {/* JOBS */}
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4 border-green-500">
                
                <div className="flex justify-between gap-4">

                  {/* INFOS */}
                  <div className="flex-1">

                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src={job.logo}
                        alt="logo"
                        width={40}
                        height={40}
                        className="rounded"
                      />

                      <div>
                        <h3 className="font-bold text-lg">{job.titre}</h3>
                        <p className="text-sm text-gray-500">{job.entreprise}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {job.description}
                    </p>

                    <div className="flex gap-3 text-xs">
                      <span>📍 {job.lieu}</span>
                      <span>💼 {job.type}</span>
                      <span>📅 {new Date(job.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="flex items-center">
                    <Link href={`/jobs/${job.id}`}>
                      <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
                        Postuler →
                      </button>
                    </Link>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}
      
      </main>
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2026 GreenItCar - Tous droits réservés
        </div>
      </footer>
    </div>
    
  );
}