"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FiEye, FiEyeOff } from "react-icons/fi";

const supabase = createClient();

export default function Inscrire() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  // 🔐 EMAIL / PASSWORD SIGN UP
  const handleLoginPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Compte créé ! Vérifie ton email.");
    }

    setLoading(false);
  };

  // 🔵 GOOGLE
  const loginWithGoogle = async () => {
    setLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // 🍎 APPLE
  const loginWithApple = async () => {
    setLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
    
    {/* Container global adaptable */}
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
      
      {/* Card */}
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
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">
            ou continuer avec
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* GOOGLE */}
        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border py-3 sm:py-3.5 rounded-full hover:bg-gray-50 transition text-sm sm:text-base"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="w-5 h-5"
            alt="Google"
          />
          Continuer avec Google
        </button>

        {/* APPLE */}
        <button
          onClick={loginWithApple}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border py-3 sm:py-3.5 rounded-full hover:bg-gray-50 mt-3 transition text-sm sm:text-base"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            alt="Apple"
            className="w-5 h-5"
          />
          Continuer avec Apple
        </button>

        {/* FOOTER */}
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  </div>
);
}