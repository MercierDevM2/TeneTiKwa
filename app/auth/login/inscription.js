"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function Inscrire() {

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  const loginWithApple = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-orange-600">
            Bienvenue sur TeneTikwa
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Votre marché d'emploi plus pret de vous
          </p>
        </div>

        <Link href="/auth/login">
          <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-full mb-4">
            Se connecter
          </button>
        </Link>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">ou continuer avec</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-full hover:bg-gray-50"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="w-5 h-5"
            alt="google"
          />
          Continuer avec Google
        </button>

        <button
          onClick={loginWithApple}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-full hover:bg-gray-50"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            alt="Apple"
            className="w-5 h-5"
          />
          Continuer avec Apple
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-blue-600">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
}