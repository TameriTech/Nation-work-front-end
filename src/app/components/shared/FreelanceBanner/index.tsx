import { Icon } from "@iconify/react";

export function FreelanceBanner() {
  return (
    <section className="w-full  px-6 py-20 bg-white">
      <div className="bg-blue-50 max-w-7xl mx-auto px-10 py-12 rounded-[70px] grid grid-cols-12 justify-between gap-10 items-start">
        <div className="col-span-7 pr-10">
          <h1 className="text-2xl font-bold text-blue-900">
            Nation <span className="text-orange-500">Work</span>
            <span className="text-white rounded-[50px] text-xl font-medium px-5 py-3 bg-slate-900">
              Pro
            </span>
          </h1>
          <h3 className="text-[50px] font-light text-black pt-10 mb-4">
            La Solution de <span className="text-blue-900">Freelance</span> pour
            toute personne qui a besoin d’un service
          </h3>
          <ul className="space-y-3 text-gray-700 text-2xl font-medium">
            {/* Add icons chevron right here */}

            <li className="flex items-center gap-2">
              <Icon
                icon={"bx:chevron-right"}
                className="text-blue-900 w-10 h-10"
              />
              Un service super rapide
            </li>
            <li className="flex items-center gap-2">
              <Icon
                icon={"bx:chevron-right"}
                className="text-blue-900 w-10 h-10"
              />
              Nos profils sont vérifiés au millimètre près
            </li>
            <li className="flex items-center gap-2">
              <Icon
                icon={"bx:chevron-right"}
                className="text-blue-900 w-10 h-10"
              />
              Modèle de paiement optimal
            </li>
            <li className="flex items-center gap-2">
              <Icon
                icon={"bx:chevron-right"}
                className="text-blue-900 w-10 h-10"
              />
              Gestion facile
            </li>
          </ul>
          <button className="mt-6 px-5 py-3 bg-blue-900 text-white rounded-[50px]">
            Trouver un prestataire
          </button>
        </div>
        <div className="col-span-5 relative h-[583px] bg-gray-300 rounded-xl">
          <div className="absolute top-18 -left-24 bg-white text-xl w-fit font-bold p-2.5 rounded-[50px] text-blue-900 px-5 py-3">
            +200 <span className="font-medium">Prestataires</span>
          </div>
          <div className="absolute bottom-18 right-24 bg-white text-xl w-fit font-bold p-2.5 rounded-[50px] text-blue-900 px-5 py-3">
            +150 <span className="font-medium">Clients</span>
          </div>
          {/* Add image or illustration here */}
        </div>
      </div>
    </section>
  );
}
