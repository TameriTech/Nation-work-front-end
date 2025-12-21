"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useCallback, useState } from "react";
import { TestimonialCard } from "@/app/components/ui/Cards/Testimonial";

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      slidesToScroll: 1, // IMPORTANT → scroll one column at a time
      align: "start",
    },
    [Autoplay({ delay: 4000 })]
  );

  const items = [1, 2, 3, 4, 5, 6];
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

  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  return (
    <section className="w-full bg-white py-14 md:py-20 px-4 md:px-6">
      <div className="bg-white shadow-2xl rounded-3xl md:rounded-[70px] p-6 md:p-10">
        <h1 className="text-lg md:text-2xl font-bold text-blue-900">
          Nation <span className="text-orange-500">Work</span>
        </h1>

        <div className="mt-4 mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-gray-700">
            Ce sont ceux qui l’utilisent qui en parlent
          </h2>

          <div className="hidden md:flex -space-x-5 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full border-4 border-white bg-gray-300"
              />
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="embla relative">
          <div className="embla__viewport overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {items.map((i) => (
                <div
                  key={i}
                  className="
                    embla__slide
                    flex-[0_0_100%]
                    sm:flex-[0_0_50%]
                    md:flex-[0_0_33.333%]
                    lg:flex-[0_0_25%]
                    px-2 sm:px-3
                  "
                >
                  <TestimonialCard />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${
                  index === selectedIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
