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
        // 3. L'utilisateur est bien admin: chargement des jobs
        if (isMounted) {
          setIsAdmin(true);

          const { data: jobsData } = await supabase
            .from("jobs")
            .select("*")
            .order("date", { ascending: false });

          if (isMounted) {
            setJobs(jobsData || []);
            setAuthChecked(true); //  On peut maintenant afficher l'interface admin
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
    if (!form.titre || !form.entreprise || !form.lieu || !form.type || !form.description || !form.logo || !form.lien || !form.source || !form.date) {
      alert("Veuillez remplir tous les champs obligatoires.");
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
          date: form.date,
        },
      ])
      .select();

    if (error) {
      console.error("Erreur lors de l'ajout :", error.message);
      alert("Erreur lors de l'ajout de l'offre.");
    } else {
      setJobs((prev) => [data[0], ...prev]);
      setForm({
        titre: "",
        entreprise: "",
        lieu: "",
        type: "",
        description: "",
        logo: "",
        lien: "",
        source: "",
        date: ""
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

  //  Pendant la vérification, on n’affiche qu’un indicateur de chargement
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Vérification de vos droits...</p>
      </div>
    );
  }

  //  Ici l’utilisateur est admin
 return (
  <div className="min-h-screen bg-gray-100 flex flex-col">

    {/* HEADER */}
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="font-bold text-lg sm:text-xl">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="text-red-500 font-medium hover:text-red-700 transition"
        >
          Déconnexion
        </button>
      </div>
    </header>

    {/* MAIN */}
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* FORM */}
          <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl shadow">
            <h2 className="font-semibold text-lg mb-4">
              Ajouter une offre
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {[
                { key: "titre", placeholder: "Titre *" },
                { key: "entreprise", placeholder: "Entreprise *" },
                { key: "lieu", placeholder: "Lieu *" },
                { key: "type", placeholder: "Type (CDI, CDD...)" },
                { key: "logo", placeholder: "Logo (URL)" },
                { key: "lien", placeholder: "Lien (URL)" },
                { key: "source", placeholder: "Source" },
                { key: "date", placeholder: "Date", type: "date" },
              ].map((field) => (
                <input
                  key={field.key}
                  placeholder={field.placeholder}
                  value={form[field.key] || ""}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 rounded-lg text-sm sm:text-base transition"
                  type={field.type || "text"}
                  required
                />
              ))}

              <textarea
                placeholder="Description *"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 rounded-lg text-sm sm:text-base transition"
                required
              />

              <button className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition text-sm sm:text-base font-medium">
                Publier
              </button>
            </form>
          </div>

          {/* LIST */}
          <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl shadow">
            <h2 className="font-semibold text-lg mb-4">
              Offres publiées
            </h2>

            {jobs.length === 0 ? (
              <p className="text-gray-400 text-sm">
                Aucune offre pour le moment.
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 p-3 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-2"
                  >
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        {job.titre}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {job.entreprise} – {job.lieu}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
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
    </main>

  </div>
);
}