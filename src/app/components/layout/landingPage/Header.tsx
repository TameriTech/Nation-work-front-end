export default function Header() {
  return (
    <header className="w-full sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-900">
          <img src="/icons/logo-text.png" alt="Logo" className="h-14" />
        </h1>
        <nav className="hidden md:flex gap-6 font-medium text-gray-700 text-base">
          <a href="#" className="hover:text-orange-500">
            Accueil
          </a>
          <a href="#" className="hover:text-orange-500">
            Comment ça marche ?
          </a>
          <a href="#" className="hover:text-orange-500">
            Devenir Prestataire
          </a>
        </nav>
        <div className="flex text-base gap-3">
          <a href="/dashboard/customer" className="px-4 py-2 text-gray-700">
            Se connecter
          </a>
          <a
            href="/dashboard/customer"
            className="px-4 py-2 rounded-2xl bg-blue-900 text-white"
          >
            Créer un compte
          </a>
        </div>
      </div>
    </header>
  );
}
