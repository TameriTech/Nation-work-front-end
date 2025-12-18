"use client";
import useEmblaCarousel from "embla-carousel-react";
import { CATEGORY_SERVICES } from "@/data/constants";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useCallback, useState } from "react";
import { ServiceCard } from "../../ui/Cards/Service";
import { Icon } from "@iconify/react";
import { CategoryName } from "@/app/types/service";

export function Services() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      slidesToScroll: 1, // IMPORTANT → scroll one column at a time
      align: "start",
    },
    [Autoplay({ delay: 4000 })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  //
  const [active, setActive] = useState<CategoryName>("Assistance Maison");

  const services = CATEGORY_SERVICES[active];

  const items = [
    "Assistance Maison",
    "Assistance Entreprise",
    "Technique",
    "Industriel",
  ];

  return (
    <section className="w-full bg-white py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-700">
            Services Populaires
          </h2>

          <a
            href="#"
            className="self-start md:self-auto rounded-full bg-blue-900 px-5 py-3 text-base md:text-xl font-semibold text-white"
          >
            Liste des Services
          </a>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex overflow-x-auto md:overflow-visible border-b text-sm sm:text-base justify-between font-semibold">
          {Object.keys(CATEGORY_SERVICES).map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat as CategoryName)}
              className={`px-4 py-3 whitespace-nowrap
                ${
                  active === cat
                    ? "text-blue-900 border-b-2 border-blue-900"
                    : "text-gray-500"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div className="embla relative">
          <div className="embla__viewport overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex gap-4 justify-around">
              {services.map((s) => (
                <div
                  key={s}
                  className="
                    embla__slide
                    flex-[0_0_100%]
                    sm:flex-[0_0_50%]
                    md:flex-[0_0_33.333%]
                    lg:flex-[0_0_25%]
                  "
                >
                  <ServiceCard title={s} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex
                       h-14 w-14 items-center justify-center rounded-full bg-white/70 shadow"
          >
            <Icon
              icon="material-symbols:chevron-left"
              className="h-8 w-8 text-blue-900"
            />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex
                       h-14 w-14 items-center justify-center rounded-full bg-white/70 shadow"
          >
            <Icon
              icon="material-symbols:chevron-right"
              className="h-8 w-8 text-blue-900"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
