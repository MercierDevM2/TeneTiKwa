"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import Fuse from 'fuse.js';
import { useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);


  const [filters, setFilters] = useState({ poste: "", lieu: "" });
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [session, setSession] = useState(null);
  const [showContactId, setShowContactId] = useState(null);

  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar_url: null,
  });

 useEffect(() => {
  let mounted = true;

  const init = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data?.session;

    if (!mounted) return;

    if (!session) {
      setAuthChecked(true); 
      return;
    }

    const currentUser = session.user;

    const { data: profile } = await supabase
      .from("profiles")
      .select("nom, avatar_url")
      .eq("id", currentUser.id)
      .maybeSingle();

    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*")
      .order("date", { ascending: false });

    if (!mounted) return;

    setSession(session);

    setUser({
      name: profile?.nom || currentUser.email?.split("@")[0],
      email: currentUser.email,
      avatar_url: profile?.avatar_url || null,
    });

    setJobs(jobsData || []);
    setFilteredJobs(jobsData || []);
    setAuthChecked(true);
  };

  init();

  return () => {
    mounted = false;
  };
}, []);

  const normalize = (text) =>
    (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const jobsWithKeywords = useMemo(() => {
    return jobs.map((job) => ({
      ...job,
      searchStrings: job.titre,
    }));
  }, [jobs]);

  const fuse = useMemo(() => {
    return new Fuse(jobsWithKeywords, {
      keys: ["searchStrings", "lieu"],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
    });
  }, [jobsWithKeywords]);

  const handleSearch = () => {
  // Si les deux champs sont vides, on affiche tout
  if (!filters.poste.trim() && !filters.lieu.trim()) {
    setFilteredJobs(jobs);
    return;
  }

  // On prépare la requête de recherche pour Fuse
  const searchQueries = [];
  if (filters.poste.trim()) {
    searchQueries.push({ searchStrings: filters.poste });
  }
  if (filters.lieu.trim()) {
    searchQueries.push({ lieu: filters.lieu });
  }

  // On utilise Fuse au lieu du .filter() classique
  const results = fuse.search({
    $and: searchQueries
  });

  // Fuse retourne un objet avec l'item original dans 'item'
  setFilteredJobs(results.map(r => r.item));
};

  const handleReset = () => {
  setFilters({ poste: "", lieu: "" });
  setFilteredJobs(jobs);
};

  const [notificationsCount, setNotificationsCount] = useState(0);

useEffect(() => {
  if (!session?.user?.id) return;

  const channel = supabase
    .channel("notifications-count")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${session.user.id}`,
      },
      () => {
        fetchNotifications();
      }
    )
    .subscribe();

  const fetchNotifications = async () => {

    const { count } = await supabase
      .from("notifications")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", session.user.id)
      .eq("is_read", false);

    setNotificationsCount(count || 0);
  };

  fetchNotifications();

  return () => {
    supabase.removeChannel(channel);
  };

}, [session?.user?.id]);

console.log("jobs:", jobs);
console.log("handleSearch exists:", typeof handleSearch);

useEffect(() => {
  if (typeof window === "undefined") return;

  if (localStorage.getItem("just_signed_up") === "true") {
    setShowAlert(true);
    localStorage.removeItem("just_signed_up");
  }
}, []);

  // 🔐 LOADING STATE
  if (!authChecked || !session) 
{
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20">

      {/* HEADER */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">

          <Image src="/icones.png" alt="logo" width={120} height={120} style={{ width: "auto", height: "auto" }} />

          <div className="flex items-center gap-4">

            <Link href="/favoris">❤️</Link>
            <div className="relative">
              <Link href="/notifications" className="text-xl">
                🔔
              </Link>

              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full animate-pulse">
                  {notificationsCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                {user.avatar_url ? (
                  <Image src={user.avatar_url} alt="Avatar" width={32} height={32} />
                ) : (
                  <span>{user.name?.charAt(0)}</span>
                )}
              </div>
              <span className="hidden md:inline">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      {showAlert && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center animate-fadeIn">

        <h2 className="text-lg font-bold text-green-600 mb-2">
          Compte activé
        </h2>

        <p className="text-gray-600 mb-4">
          Votre compte a été activé avec succès.
        </p>

        <button
          onClick={() => {
            setShowAlert(false);
            router.replace("/dashboard");
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg w-full"
        >
          OK
        </button>

      </div>
    </div>
  )}
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
                id="btn-research"
              >
                🔍 Rechercher
              </button>

              <button
                onClick={handleReset}
                className="border px-4 py-2 rounded"
                id="btn-reset"
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

                <div className="flex justify-between gap-4 items-start">

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-3 mb-2">

                      <Image
                        src={job.logo || "/placeholder.png"}
                        alt="logo"
                        width={40}
                        height={40}
                        unoptimized
                      />

                      <div className="min-w-0">
                        <h3 className="font-bold text-lg break-words leading-tight">
                          {job.titre}</h3>
                        <p className="text-sm text-gray-500 truncate">
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

                  <div className="flex flex-col gap-2">

                    {/* 🔗 Postuler = lien externe */}
                   {job.lien ? (
                    <Link href={job.lien} target="_blank">
                      <button className="bg-green-600 text-white px-5 py-2 rounded-lg w-full" id="btn-postuler">
                        Postuler →
                      </button>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-300 text-gray-600 px-5 py-2 rounded-lg w-full cursor-not-allowed"
                      id="btn-postuler-disabled"
                    >
                      Aucun lien
                    </button>
                  )}

                    {/* 📞 Contact */}
                    <button
                      onClick={() =>
                        setShowContactId(showContactId === job.id ? null : job.id)
                      }
                      className="border border-green-600 text-green-600 px-5 py-2 rounded-lg w-full"
                      id="btn-voir-contact"
                    >
                      Voir Contact
                    </button>

                    {/* 🟢 MODAL CONTACT */}
                    {showContactId === job.id && (
                      <div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                        onClick={() => setShowContactId(null)} // clic extérieur
                      >
                        <div
                          className="bg-white p-5 rounded-xl shadow-xl w-[90%] max-w-sm"
                          onClick={(e) => e.stopPropagation()} // empêche fermeture si clic dedans
                        >
                          <h3 className="font-semibold text-lg mb-2 text-green-600">
                            Contact
                          </h3>

                          <p className="text-gray-600 text-sm">
                            {job.adresse || "Aucune information disponible"}
                          </p>

                          <button
                            onClick={() => setShowContactId(null)}
                            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
                            id="btn-fermer-contact"
                          >
                            Fermer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  </div>

              </div>
            ))
          )}

        </div>

      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white border-t py-6 z-50">
        <div className="text-center text-gray-500 text-sm">
        © 2026 GreenItCar tous droits réservés.
      </div>
    </footer>

    </div>
  );
}