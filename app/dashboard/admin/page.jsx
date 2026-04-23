"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [authChecked, setAuthChecked] = useState(false); // true uniquement si admin confirmé
  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    titre: "",
    entreprise: "",
    lieu: "",
    type: "",
    description: "",
    logo: "",
    lien: "",
    source: "",
  });

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      // 1. Récupération de la session
      const { data: { session } } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!session) {
        console.log("Aucun utilisateur connecté");
        router.replace("/");
        return;
      }

      // 2. Vérification du rôle dans profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!isMounted) return;

      if (error || profile?.role !== "admin") {
        console.log("Accès refusé : pas admin");
        router.replace("/dashboard");
      } else {
        // 3. L'utilisateur est bien admin → chargement des jobs
        if (isMounted) {
          setIsAdmin(true);

          const { data: jobsData } = await supabase
            .from("jobs")
            .select("*")
            .order("date", { ascending: false });

          if (isMounted) {
            setJobs(jobsData || []);
            setAuthChecked(true); // ✅ On peut maintenant afficher l'interface admin
          }
        }
      }
    };

    checkAdmin();

    // Écouteur de déconnexion
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.replace("/");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 🚪 Déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ➕ Ajouter une offre
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titre || !form.entreprise || !form.lieu) {
      alert("Veuillez remplir les champs obligatoires (titre, entreprise, lieu)");
      return;
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert([
        {
          titre: form.titre,
          entreprise: form.entreprise,
          lieu: form.lieu,
          type: form.type,
          description: form.description,
          logo: form.logo,
          lien: form.lien,
          source: form.source,
        },
      ])
      .select();

    if (error) {
      console.error("Erreur lors de l'ajout :", error.message);
      alert("Erreur lors de l'ajout de l'offre.");
    } else {
      setJobs((prev) => [data[0], ...prev]); // ajout en tête de liste
      setForm({
        titre: "",
        entreprise: "",
        lieu: "",
        type: "",
        description: "",
        logo: "",
        lien: "",
        source: "",
      });
      alert("Offre publiée !");
    }
  };

  // ❌ Supprimer une offre
  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette offre ?")) return;

    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) {
      console.error("Erreur de suppression :", error.message);
      alert("Erreur lors de la suppression.");
    } else {
      setJobs((prev) => prev.filter((job) => job.id !== id));
    }
  };

  // ⏳ Pendant la vérification, on n’affiche qu’un indicateur de chargement
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Vérification de vos droits...</p>
      </div>
    );
  }

  // ✅ Ici l’utilisateur est admin, l’interface s’affiche sans flash parasite
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-red-500 font-medium">
          Déconnexion
        </button>
      </header>

      <div className="p-6 grid md:grid-cols-2 gap-6">
        {/* FORMULAIRE D'AJOUT */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Ajouter une offre</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              placeholder="Titre *"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              placeholder="Entreprise *"
              value={form.entreprise}
              onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              placeholder="Lieu *"
              value={form.lieu}
              onChange={(e) => setForm({ ...form, lieu: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
            <input
              placeholder="Type (CDI, CDD...)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
            <input
              placeholder="Logo (URL)"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              placeholder="Lien (URL)"
              value={form.lien}
              onChange={(e) => setForm({ ...form, lien: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              placeholder="Source"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
              Publier
            </button>
          </form>
        </div>

        {/* LISTE DES OFFRES */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Offres publiées</h2>

          {jobs.length === 0 ? (
            <p className="text-gray-400">Aucune offre pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{job.titre}</p>
                    <p className="text-sm text-gray-500">
                      {job.entreprise} – {job.lieu}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}