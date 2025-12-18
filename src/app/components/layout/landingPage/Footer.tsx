export function Footer() {
  return (
    <footer className="pt-16 bg-blue-900 text-white">
      <div className="flex  px-2 md:px-6 gap-2">
        <img
          src={"/icons/logo.png"}
          className="w-[57px]"
          alt="Nation work Logo"
        />
        <img
          src={"/icons/logo2.png"}
          className="w-[228px]"
          alt="Nation work Logo Text"
        />
      </div>

      <div className="container px-2 md:px-6 mx-auto pt-5 grid md:grid-cols-4 gap-10">
        <div>
          <h4 className="font-semibold mb-2">Catégories</h4>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>Assistance</li>
            <li>Réparation Electroménager</li>
            <li>Maintenance Electrique</li>
            <li>Déménagement</li>
            <li>Lessive</li>
            <li>Coiffure</li>
            <li>Coutur</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">
            Pour les particuliers et entreprises
          </h4>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>Pourquoi Nation Work ?</li>
            <li>Marché des Freelancers </li>
            <li>Gagnez en temps</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Pour les freelancer</h4>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>Pourquoi Nation Work ?</li>
            <li>Formation</li>
            <li>Suivi</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Actualité</h4>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>Actualite 1</li>
            <li>Actualite 2</li>
            <li>Actualite 3</li>
          </ul>
        </div>
      </div>
      <div className="text-center bg-blue-950 py-5 px-2 md:px-6 text-xs mt-10">
        <div className="flex justify-between items-center">
          <span className="text-sm">
            © 2025 Nation Work. Tous droits réservés.
          </span>
          <img
            src={"/icons/logo.png"}
            className="w-[55px]"
            alt="Nation work Logo"
          />
        </div>
      </div>
    </footer>
  );
}
