"use client";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const slides = [1, 2, 3]; // 3 slides identiques

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  return (
    <div className="embla bg-white px-4 sm:px-6 py-6 relative w-full">
      <div className="embla__viewport bg-white overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {/** Slide 1 */}
          <div className="embla__slide flex-[0_0_100%] relative pb-9 bg-blue-900 rounded-[40px] sm:rounded-[70px] overflow-hidden">
            {/* background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/hero-bg.png')` }}
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* content */}
            <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-4xl">
              <p className="text-white/90 text-sm sm:text-lg mb-4">
                Simple & Rapide
              </p>

              <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-medium leading-tight mb-6">
                <span className="font-semibold">
                  Besoin d’un coup de main ?
                </span>
                <br />
                disponible quand vous en avez besoin.
              </h1>

              <div className="bg-white/20 backdrop-blur-md p-4 sm:p-6 rounded-3xl max-w-xl border border-white/30">
                <p className="text-white text-base md:text-lg">
                  Une plateforme rapide et accessible. <br />
                  Des prestataires motivés pour vos besoins ponctuels, <br />
                  fiables et abordables.
                </p>

                <div className="w-full bg-white rounded-full flex items-center px-4 py-3 shadow-lg">
                  <input
                    type="text"
                    placeholder="Recherche"
                    className="flex-1 outline-none text-gray-700 bg-transparent"
                  />
                  <button className="text-blue-600 text-xl">⍰</button>
                </div>
              </div>
            </div>

            {/* image desktop */}
            <img
              src="/images/hero-man.png"
              alt=""
              className="hidden lg:block absolute right-0 bottom-0 h-full object-cover"
            />
          </div>

          {/** SLide 2 */}
          <div className="embla__slide flex-[0_0_100%] relative pb-9 bg-green-600 rounded-[40px] sm:rounded-[70px] overflow-hidden">
            {/* background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/hero-bg.png')` }}
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* content */}
            <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-4xl">
              <p className="text-white/90 text-sm sm:text-lg mb-4">
                Simple & Rapide
              </p>

              <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-medium leading-tight mb-6">
                <span className="font-semibold">
                  Besoin d’un coup de main ?
                </span>
                <br />
                disponible quand vous en avez besoin.
              </h1>

              <div className="bg-white/20 backdrop-blur-md p-4 sm:p-6 rounded-3xl max-w-xl border border-white/30">
                <p className="text-white text-base md:text-lg">
                  Une plateforme rapide et accessible. <br />
                  Des prestataires motivés pour vos besoins ponctuels, <br />
                  fiables et abordables.
                </p>

                <div className="w-full bg-white rounded-full flex items-center px-4 py-3 shadow-lg">
                  <input
                    type="text"
                    placeholder="Recherche"
                    className="flex-1 outline-none text-gray-700 bg-transparent"
                  />
                  <button className="text-blue-600 text-xl">⍰</button>
                </div>
              </div>
            </div>

            {/* image desktop */}
            <img
              src="/images/hero-man.png"
              alt=""
              className="hidden lg:block absolute right-0 bottom-0 h-full object-cover"
            />
          </div>

          {/** Slide 3 */}
          <div className="embla__slide flex-[0_0_100%] relative pb-9 bg-amber-500 rounded-[40px] sm:rounded-[70px] overflow-hidden">
            {/* background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/hero-bg.png')` }}
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* content */}
            <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-4xl">
              <p className="text-white/90 text-sm sm:text-lg mb-4">
                Simple & Rapide
              </p>

              <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-medium leading-tight mb-6">
                <span className="font-semibold">
                  Besoin d’un coup de main ?
                </span>
                <br />
                disponible quand vous en avez besoin.
              </h1>

              <div className="bg-white/20 backdrop-blur-md p-4 sm:p-6 rounded-3xl max-w-xl border border-white/30">
                <p className="text-white text-base md:text-lg">
                  Une plateforme rapide et accessible. <br />
                  Des prestataires motivés pour vos besoins ponctuels, <br />
                  fiables et abordables.
                </p>

                <div className="w-full bg-white rounded-full flex items-center px-4 py-3 shadow-lg">
                  <input
                    type="text"
                    placeholder="Recherche"
                    className="flex-1 outline-none text-gray-700 bg-transparent"
                  />
                  <button className="text-blue-600 text-xl">⍰</button>
                </div>
              </div>
            </div>

            {/* image desktop */}
            <img
              src="/images/hero-man.png"
              alt=""
              className="hidden lg:block absolute right-0 bottom-0 h-full object-cover"
            />
          </div>
        </div>

        {/* pagination */}
        <div className="flex justify-center bottom-12 right-12 absolute sm:bottom-16 sm:right-16 md:bottom-16 md:right-16 lg:bottom-28 lg:right-16 gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-4 h-4 rounded-full ${
                index === selectedIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
