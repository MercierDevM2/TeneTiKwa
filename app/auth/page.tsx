import Link from "next/link";

export default function AuthChoicePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold mb-2 text-center">
          Bienvenue sur TeneTikwa
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Connectez-vous ou créez un compte
        </p>

        {/* BOUTON CONNEXION */}
        <Link href="/auth/login">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg mb-3 font-medium hover:bg-blue-700 transition">
            Se connecter
          </button>
        </Link>

        {/* BOUTON INSCRIPTION */}
        <Link href="/auth/register">
        
        </Link>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou</span>
          </div>
        </div>

        {/* BOUTONS SOCIAUX */}
        <button className="w-full bg-red-500 text-white py-3 rounded-lg mb-3 hover:bg-red-600 transition">
          Continuer avec Google
        </button>

        <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
          Continuer avec Apple
        </button>

        <Link href="/" className="block text-center mt-4 text-gray-500 hover:text-gray-700">
          ← Retour à l'accueil
        </Link>

      </div>
    </div>
  );
}