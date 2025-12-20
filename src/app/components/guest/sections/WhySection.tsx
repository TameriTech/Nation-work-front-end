export function WhySection() {
  const items = ["Rapidite", "Confiance", "Simplicite"];

  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center text-gray-700">
          Pourquoi Nation <span className="text-orange-500">Work</span> ?
        </h2>

        <p className="mt-4 mb-10 text-base sm:text-lg text-center text-gray-600">
          courte description courte description courte description
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {items.map((title) => (
            <div key={title} className="text-center">
              <div
                className="mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100
                              w-20 h-20 sm:w-24 sm:h-24 md:w-[110px] md:h-[110px]"
              >
                <img
                  src={`/icons/${title.toLowerCase()}.png`}
                  alt={title}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-[70px] md:h-[70px]"
                />
              </div>

              <h3 className="text-lg md:text-xl font-medium text-orange-500 mb-2">
                {title}
              </h3>

              <p className="text-sm md:text-base text-black">
                Courte description courte description
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
