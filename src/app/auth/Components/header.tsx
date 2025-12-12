export default function Header() {
  return (
    <header className="w-full sticky rounded-[30px] h-20 top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-900">
          <img src="/icons/logo-text.png" alt="Logo" className="h-14" />
        </h1>
        <nav className="hidden md:flex gap-6 font-medium text-gray-700 text-base">
          <a href="#" className="hover:text-orange-500">
            {"Vous avez déjà un compte ?"}
          </a>
          <a href="#" className="text-blue-900">
            Connectez vous
          </a>
        </nav>
      </div>
    </header>
  );
}
