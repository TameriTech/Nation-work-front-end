export function WhySection() {
  const items = [
    { title: "Rapidité", desc: "Service rapide" },
    { title: "Confiance", desc: "Profils vérifiés" },
    { title: "Simplicité", desc: "Plateforme intuitive" },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-[52px] font-semibold text-center text-gray-700">
          Pourquoi Nation <span className="text-orange-500">Work</span> ?
        </h2>
        <p className="text-lg text-center text-gray-600 mb-10">
          courte description courte description courte description
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {["Rapidite", "Confiance", "Simplicite"].map((title) => (
            <div key={title} className="text-center">
              <div className="w-[110px] h-[110px] p-5 bg-gray-100 rounded-full flex justify-center items-center mx-auto mb-4">
                <img
                  src={`/icons/${title.toLowerCase()}.png`}
                  alt={title}
                  className="w-[70px] h-[70px] mx-auto"
                />
              </div>
              <h3 className="font-medium text-xl text-orange-500 mb-2">
                {title}
              </h3>
              <p className="text-base font-normal text-black">
                Courte description courte description
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
