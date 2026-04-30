"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import Fuse from 'fuse.js';
import { useMemo, useCallback } from "react";
export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [filters, setFilters] = useState({ poste: "", lieu: "" });
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [session, setSession] = useState(null);

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
      router.replace("/");
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

const [poste, setPoste] = useState("");
const [lieu, setLieu] = useState("");
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
  let results = [...jobs];

  // 🔍 POSTE
  if (filters.poste.trim()) {
    const q = normalize(filters.poste);

    results = results.filter(job =>
      normalize(job.titre).includes(q)
    );
  }

  // 📍 LIEU
  if (filters.lieu.trim()) {
    const q = normalize(filters.lieu);

    results = results.filter(job =>
      normalize(job.lieu).includes(q)
    );
  }

  setFilteredJobs(results);
};
  const handleReset = () => {
  setFilters({ poste: "", lieu: "" });
  setFilteredJobs(jobs);
};

  const [notificationsCount, setNotificationsCount] = useState(0);

useEffect(() => {
  if (!session?.user?.id) return;

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("is_read", false);

    setNotificationsCount(data?.length || 0);
  };

  fetchNotifications();
}, [session?.user?.id]);

console.log("jobs:", jobs);
console.log("handleSearch exists:", typeof handleSearch);
  // 🔐 LOADING STATE
  if (!authChecked) {
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

          <Image src="/icones.png" alt="logo" width={120} height={120} />

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

      <footer className="fixed bottom-0 left-0 w-full bg-white border-t py-6 z-50">
        <div className="text-center text-gray-500 text-sm">
        © 2026 GreenItCar tous droits réservés.
      </div>
    </footer>

    </div>
  );
}