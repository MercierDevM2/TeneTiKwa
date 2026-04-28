"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FiEye, FiEyeOff } from "react-icons/fi";

const supabase = createClient();

export default function Connexion() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  // 🔐 EMAIL / PASSWORD
const handleLoginPassword = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  // ❌ cas 1 : compte inexistant OU mauvais login
  if (error) {
    if (
      error.message.includes("Invalid login credentials") ||
      error.message.includes("Email not confirmed") ||
      error.message.includes("Invalid")
    ) {
      setError("Compte introuvable. Redirection vers inscription...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);

      setLoading(false);
      return;
    }

    setError("Erreur de connexion");
    setLoading(false);
    return;
  }

  const user = data.user;

  // 🔍 profil
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    router.push("/admin");
  } else {
    router.push("/dashboard");
  }

  setLoading(false);
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
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">

    {/* Container adaptatif */}
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">

        {/* HEADER */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600">
            Bienvenue sur TeneTikwa
          </h1>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm lg:text-base">
            Votre marché d'emploi près de vous
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLoginPassword} className="space-y-4 sm:space-y-5">

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 sm:p-3.5 rounded-lg text-sm sm:text-base transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 sm:p-3.5 rounded-lg pr-10 text-sm sm:text-base transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs sm:text-sm">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 sm:py-3.5 rounded-full hover:bg-blue-700 transition text-sm sm:text-base font-medium"
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
          className="w-full flex items-center justify-center gap-3 border py-3 sm:py-3.5 rounded-full hover:bg-gray-50 transition text-sm sm:text-base"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="w-5 h-5"
            alt="google"
          />
          <span className="font-medium">
            Continuer avec Google
          </span>
        </button>

      </div>
    </div>
  </div>
);
}