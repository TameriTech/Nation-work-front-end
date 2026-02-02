export function TestimonialCard() {
  return (
    <div className="bg-gray-100 rounded-xl shadow relative p-4 mb-18">
      <p className="text-sm font-light text-gray-600 pt-2.5 pb-[50px]">
        "Court Témoignage Court Témoignage Court Témoignage Court Témoignage "
      </p>
      <div className="absolute -bottom-15 flex items-center gap-3 mb-3">
        <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-300"></div>
        <div>
          <p className="font-medium text-sm text-black">Nom Utilisateur</p>
          <div className="flex items-center mt-1">
            <span className="text-orange-500 text-[15px]">★★★★☆</span>
            <span className="text-gray-500 text-xs ml-2">(4.0)</span>
          </div>
          <p className="text-xs font-normal text-gray-500">Titre</p>
        </div>
      </div>
    </div>
  );
}
