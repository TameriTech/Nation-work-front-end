"use client";
import { randomInt } from "crypto";
import { useRef, useState, useEffect } from "react";
import { providersByCategory } from "@/data/contants";
import { motion, AnimatePresence } from "framer-motion";
import { ProviderCard } from "../../ui/Cards/Provider";

export function ProvidersList() {
  const sectionsRef = useRef([]);
  const [activeTab, setActiveTab] = useState(0);

  const categories = Object.keys(providersByCategory);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionsRef.current.indexOf(entry.target);
            if (index !== -1) setActiveTab(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionsRef.current.forEach(
      (section) => section && observer.observe(section)
    );

    return () => observer.disconnect();
  }, []);

  // Fonction pour afficher les étoiles en fonction de la note
  const renderStars = (rate) => {
    const fullStars = Math.floor(rate);
    const halfStar = rate - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {"★".repeat(fullStars)}
        {halfStar ? "☆" : ""}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  return (
    <section className="w-full bg-white mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[52px] font-semibold text-gray-700">
          Oui, +200 <span className="text-orange-500">Prestataires</span>
        </h2>
        <a
          href="#"
          className="bg-blue-900 text-white border px-5 py-3 text-xl rounded-[50px] font-semibold"
        >
          Trouvez un profil
        </a>
      </div>

      {/** Services tab header */}
      <div className="flex justify-between text-xl font-semibold text-gray-600 gap-6 border-b mb-6">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`w-1/4 p-4 text-center font-semibold cursor-pointer transition-colors ${
              activeTab === i
                ? "text-blue-900 border-b-2 border-blue-900"
                : "text-gray-600 hover:text-blue-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sections avec animation */}
      <div className="relative h-fit">
        <AnimatePresence mode="wait">
          {categories.map((cat, i) =>
            i === activeTab ? (
              <motion.div
                key={cat}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className=" w-full top-0 left-0"
              >
                <h2 className="text-2xl hidden font-bold mb-6">{cat}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {providersByCategory[cat]
                    .slice(0, 4)
                    .map((provider, index) => (
                      <ProviderCard
                        key={index}
                        provider={provider}
                        index={index}
                        renderStars={renderStars}
                      />
                    ))}
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
