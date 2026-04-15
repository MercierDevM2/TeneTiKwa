"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    poste: "",
    lieu: "",
  });
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "Utilisateur", email: "user@example.com" });

  // Simulation de données d'offres d'emploi
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
      description: "Supervision des soins médicaux dans le centre de santé.",
      logo: "/logos/msf.png"
    },
    {
      id: 3,
      titre: "Chauffeur logisticien",
      entreprise: "WFP",
      lieu: "Bambari",
      type: "CDD",
      date: "2026-04-13",
      description: "Transport et livraison de matériel humanitaire.",
      logo: "/logos/wfp.png"
    },
    {
      id: 4,
      titre: "Comptable",
      entreprise: "UNICEF",
      lieu: "Bangui",
      type: "CDI",
      date: "2026-04-12",
      description: "Gestion financière et reporting des projets.",
      logo: "/logos/unicef.png"
    },
    {
      id: 5,
      titre: "Ingénieur agronome",
      entreprise: "FAO",
      lieu: "Berbérati",
      type: "Consultant",
      date: "2026-04-11",
      description: "Appui aux agriculteurs et formation aux bonnes pratiques.",
      logo: "/logos/fao.png"
    },
    {
      id: 6,
      titre: "Responsable RH",
      entreprise: "Orange RCA",
      lieu: "Bangui",
      type: "CDI",
      date: "2026-04-10",
      description: "Recrutement, gestion des carrières et administration du personnel.",
      logo: "/logos/orange.png"
    }
  ];

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/auth/login");
    }

    // Charger les offres
    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    }, 500);
  }, []);

  // Fonction de recherche/filtrage
  const handleSearch = () => {
    let filtered = [...jobs];

    if (filters.poste.trim() !== "") {
      filtered = filtered.filter(job =>
        job.titre.toLowerCase().includes(filters.poste.toLowerCase())
      );
    }

    if (filters.lieu.trim() !== "") {
      filtered = filtered.filter(job =>
        job.lieu.toLowerCase().includes(filters.lieu.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  // Réinitialiser les filtres
  const handleReset = () => {
    setFilters({ poste: "", lieu: "" });
    setFilteredJobs(jobs);
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER AVEC PROFIL */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/icones.png" alt="logo" width={40} height={40} />
            <span className="font-bold text-xl hidden sm:inline">TeneTikwa</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm hidden md:inline">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="container mx-auto px-4 py-6">
        
        {/* SECTION FILTRES - 3 CHAMPS */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Trouvez votre prochain job
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Champ Poste */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Poste / Métier
              </label>
              <input
                type="text"
                placeholder="Ex: Infirmier, Comptable..."
                value={filters.poste}
                onChange={(e) => setFilters({ ...filters, poste: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            {/* Champ Lieu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lieu
              </label>
              <input
                type="text"
                placeholder="Ex: Bangui, Bouar..."
                value={filters.lieu}
                onChange={(e) => setFilters({ ...filters, lieu: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            {/* Bouton Rechercher */}
            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
              >
                🔍 Rechercher
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                ↺
              </button>
            </div>
          </div>
        </div>

        {/* COMPTEUR DE RÉSULTATS */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            {filteredJobs.length} offre{filteredJobs.length > 1 ? "s" : ""} trouvée{filteredJobs.length > 1 ? "s" : ""}
          </p>
          <select className="border rounded-lg px-3 py-1 text-sm">
            <option>Plus récentes</option>
            <option>Plus anciennes</option>
          </select>
        </div>

        {/* FIL D'ACTUALITÉ DES JOBS */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Aucune offre ne correspond à vos critères</p>
            <button onClick={handleReset} className="mt-4 text-green-600 hover:underline">
              Voir toutes les offres
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition border-l-4 border-green-500"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Logo + Infos */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
                        {job.logo ? "📁" : "🏢"}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {job.titre}
                        </h3>
                        <p className="text-sm text-gray-500">{job.entreprise}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        📍 {job.lieu}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        💼 {job.type}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        📅 {new Date(job.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>

                  {/* Bouton Postuler */}
                  <div className="flex items-center">
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition whitespace-nowrap">
                      Postuler →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER SIMPLE */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2026 TeneTikwa - Tous droits réservés
        </div>
      </footer>
    </div>
  );
}