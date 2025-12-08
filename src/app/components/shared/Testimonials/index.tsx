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
    <section className="w-full  bg-white mx-auto px-6 py-20">
      <div className="shadow-2xl bg-white p-10 rounded-[70px]">
        <h1 className="text-2xl font-bold text-blue-900">
          Nation <span className="text-orange-500">Work</span>
        </h1>
        <div className="mb-8 flex justify-between items-center ">
          <div className="">
            <h2 className="text-[50px] text-gray-700 font-semibold">
              Ce sont ceux qui l’utilisent qui en parlent
            </h2>
          </div>

          {/** liste de photo de profile arrondi et superposes */}
          <div className="flex -space-x-5 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-full border-4 border-white bg-gray-300"
              ></div>
            ))}
          </div>
        </div>

        <div className="embla relative">
          {/* Viewport */}
          <div className="embla__viewport overflow-hidden" ref={emblaRef}>
            {/* Container */}
            <div className="embla__container flex">
              {items.map((i) => (
                <div
                  key={i}
                  className="
                embla__slide 
                flex-[0_0_100%] 
                sm:flex-[0_0_50%] 
                md:flex-[0_0_25%]
                px-3
              "
                >
                  <TestimonialCard />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-5 h-5 rounded-full transition 
              ${index === selectedIndex ? "bg-blue-600" : "bg-gray-300"}
            `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
