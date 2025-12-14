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
    <section className="w-full bg-white mx-auto px-6 py-20">
      <div className="max-w-7xl m-auto p-6 ">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-[52px] font-semibold text-gray-700">
            Services Populaires
          </h2>
          <a
            href="#"
            className="bg-blue-900 text-white border px-5 py-3 text-xl rounded-[50px] font-semibold"
          >
            Liste des Services
          </a>
        </div>

        {/** Services tab header */}
        <div className="flex justify-between text-xl font-semibold text-gray-600 gap-6 border-b mb-6">
          {Object.keys(CATEGORY_SERVICES).map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat as CategoryName)}
              className={[
                "w-1/4 text-center p-4 hover:cursor-pointer",
                active === cat
                  ? "text-blue-900 border-b-2 border-blue-900"
                  : "text-gray-500",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="hidden justify-between text-xl font-semibold text-gray-600 gap-6 border-b mb-6">
          <button className="text-blue-900 border-blue-900 border-b-2 p-4 w-1/4 font-semibold text-center hover:cursor-pointer">
            Assistance Maison
          </button>
          <button className="w-1/4 font-semibold text-center hover:cursor-pointer">
            Assistance Entreprise
          </button>
          <button className="w-1/4 font-semibold text-center hover:cursor-pointer">
            Technique
          </button>
          <button className="w-1/4 font-semibold text-center hover:cursor-pointer">
            Industriel
          </button>
        </div>

        {/** Services tab content */}
        <div className="embla relative">
          {/* Viewport */}
          <div className="embla__viewport overflow-hidden" ref={emblaRef}>
            {/* Container */}
            <div className="embla__container flex">
              {services.map((s) => (
                <div
                  key={s}
                  className="
                        embla__slide 
                        flex-[0_0_100%] 
                        sm:flex-[0_0_50%] 
                        md:flex-[0_0_25%]
                        px-3
                      "
                >
                  <ServiceCard title={s} />
                </div>
              ))}
            </div>
          </div>
          {/** navigation */}
          <button
            className="absolute top-1/2 w-20 h-20 flex justify-center items-center -left-6 transform -translate-y-1/2 bg-white/50 shadow rounded-full p-2"
            onClick={scrollPrev}
          >
            <Icon
              icon="material-symbols:chevron-left"
              className=" w-10 h-10 text-blue-900"
            />
          </button>
          <button
            className="absolute top-1/2 w-20 h-20 flex justify-center items-center -right-6 transform -translate-y-1/2 bg-white/50 shadow rounded-full p-2"
            onClick={scrollNext}
          >
            <Icon
              icon="material-symbols:chevron-right"
              className=" w-10 h-10 text-blue-900"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
