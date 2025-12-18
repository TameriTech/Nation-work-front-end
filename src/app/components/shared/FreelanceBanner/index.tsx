import { Icon } from "@iconify/react";

export function FreelanceBanner() {
  return (
    <section className="w-full px-4 sm:px-6 py-14 sm:py-20 bg-white">
      <div className="bg-blue-50 max-w-7xl mx-auto px-6 sm:px-10 py-10 sm:py-12 rounded-[40px] sm:rounded-[70px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* LEFT */}
        <div className="lg:col-span-7">
          <h1 className="flex flex-wrap items-center gap-3 text-xl sm:text-2xl font-bold text-blue-900">
            Nation <span className="text-orange-500">Work</span>
            <span className="bg-slate-900 text-white rounded-full text-sm sm:text-base px-4 py-1">
              Pro
            </span>
          </h1>

          <h3 className="text-3xl sm:text-4xl lg:text-[50px] font-light text-black pt-6 sm:pt-10 mb-6 leading-tight">
            La Solution de <span className="text-blue-900">Freelance</span> pour
            toute personne qui a besoin d’un service
          </h3>

          <ul className="space-y-4 text-gray-700 text-lg sm:text-2xl font-medium">
            {[
              "Un service super rapide",
              "Nos profils sont vérifiés au millimètre près",
              "Modèle de paiement optimal",
              "Gestion facile",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Icon
                  icon="bx:chevron-right"
                  className="text-blue-900 w-7 h-7 mt-1"
                />
                {item}
              </li>
            ))}
          </ul>

          <button className="mt-8 px-6 py-3 bg-blue-900 text-white rounded-full text-base sm:text-lg">
            Trouver un prestataire
          </button>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 relative h-[300px] sm:h-[420px] lg:h-[580px] bg-gray-300 rounded-xl">
          {/* badge 1 */}
          <div className="absolute top-4 left-4 sm:top-10 sm:-left-16 bg-white text-sm sm:text-lg font-bold rounded-full px-4 py-2 text-blue-900 shadow">
            +200 <span className="font-medium">Prestataires</span>
          </div>

          {/* badge 2 */}
          <div className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 bg-white text-sm sm:text-lg font-bold rounded-full px-4 py-2 text-blue-900 shadow">
            +150 <span className="font-medium">Clients</span>
          </div>

          {/* image ici */}
        </div>
      </div>
    </section>
  );
}
