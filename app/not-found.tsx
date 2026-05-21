export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-6">
        Page introuvable
      </p>

      <a
        href="/"
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
      >
        Retour à l’accueil
      </a>
    </div>
  );
}