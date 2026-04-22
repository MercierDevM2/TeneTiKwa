"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function Connexion() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 EMAIL / PASSWORD
  const handleLoginPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  // 🔵 GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError("Erreur connexion Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

        <h1 className="text-2xl font-bold text-center mb-6">
          Connexion
        </h1>

        {/* FORM */}
        <form onSubmit={handleLoginPassword} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full border p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-full hover:bg-gray-50"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="w-5 h-5"
            alt="google"
          />
          <span className="text-sm font-medium">
            Continuer avec Google
          </span>
        </button>

      </div>
    </div>
  );
}