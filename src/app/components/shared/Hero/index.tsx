"use client";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import HeroSlide from "./HeroSlide";

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
    <div className="embla bg-white px-6 py-5 relative w-full">
      {/* Viewport */}
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {/** Hero carousel slide 1 */}
          <div className="embla__slide flex-[0_0_100%]  relative shadow-2xl bg-blue-900 p-10 rounded-[70px]">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/images/hero-bg.png')`,
              }}
            />

            {/* Overlay gradient (soft darkening for text readability) */}
            <div className="absolute h-full rounded-[70px] inset-0 bg-black/10" />

            {/* Content */}
            <div className="relative z-10 p-8 md:p-16 max-w-4xl">
              <p className="text-white/90 text-lg font-medium mb-4">
                Simple & Rapide
              </p>

              <h1 className="text-white text-4xl md:text-6xl font-medium leading-tight mb-8">
                <span className="font-semibold">
                  Besoin <br />
                  d’un coup de main ? <br />
                </span>
                disponible quand vous en <br />
                avez besoin.
              </h1>

              {/* Description + search */}
              <div className="bg-white/20 backdrop-blur-md p-4 md:p-6 rounded-[30px] max-w-xl border border-white/30">
                <p className="text-white text-base md:text-lg">
                  Une plateforme rapide et accessible. <br />
                  Des prestataires motivés pour vos besoins ponctuels, <br />
                  fiables et abordables.
                </p>

                {/* Search Box */}
                <div className="mt-4 w-full bg-white rounded-full flex items-center px-4 py-3 shadow-lg">
                  <input
                    type="text"
                    placeholder="recherche"
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                  />
                  <button className="text-blue-600 text-xl">⍰</button>
                </div>
              </div>
            </div>

            {/* Right-side image (man smiling) */}
            <img
              src="/images/hero-man.png"
              alt="hero person"
              className="hidden md:block absolute right-0 bottom-0 h-full object-cover"
            />
          </div>

          {/** Hero carousel slide 2 */}
          <div className="embla__slide flex-[0_0_100%]  relative shadow-2xl bg-yellow-900 p-10 rounded-[70px]">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/images/hero-bg.png')`,
              }}
            />

            {/* Overlay gradient (soft darkening for text readability) */}
            <div className="absolute h-full rounded-[70px] inset-0 bg-black/10" />

            {/* Content */}
            <div className="relative z-10 p-8 md:p-16 max-w-4xl">
              <p className="text-white/90 text-lg font-medium mb-4">
                Simple & Rapide
              </p>

              <h1 className="text-white text-4xl md:text-6xl font-medium leading-tight mb-8">
                <span className="font-semibold">
                  Besoin <br />
                  d’un coup de main ? <br />
                </span>
                disponible quand vous en <br />
                avez besoin.
              </h1>

              {/* Description + search */}
              <div className="bg-white/20 backdrop-blur-md p-4 md:p-6 rounded-[30px] max-w-xl border border-white/30">
                <p className="text-white text-base md:text-lg">
                  Une plateforme rapide et accessible. <br />
                  Des prestataires motivés pour vos besoins ponctuels, <br />
                  fiables et abordables.
                </p>

                {/* Search Box */}
                <div className="mt-4 w-full bg-white rounded-full flex items-center px-4 py-3 shadow-lg">
                  <input
                    type="text"
                    placeholder="recherche"
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                  />
                  <button className="text-blue-600 text-xl">⍰</button>
                </div>
              </div>
            </div>

            {/* Right-side image (man smiling) */}
            <img
              src="/images/hero-man.png"
              alt="hero person"
              className="hidden md:block absolute right-0 bottom-0 h-full object-cover"
            />
          </div>

          {/** Hero carousel slide 3 */}
          <div className="embla__slide flex-[0_0_100%]  relative shadow-2xl bg-orange-900 p-10 rounded-[70px]">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/images/hero-bg.png')`,
              }}
            />

            {/* Overlay gradient (soft darkening for text readability) */}
            <div className="absolute h-full rounded-[70px] inset-0 bg-black/10" />

            {/* Content */}
            <div className="relative z-10 p-8 md:p-16 max-w-4xl">
              <p className="text-white/90 text-lg font-medium mb-4">
                Simple & Rapide
              </p>

              <h1 className="text-white text-4xl md:text-6xl font-medium leading-tight mb-8">
                <span className="font-semibold">
                  Besoin <br />
                  d’un coup de main ? <br />
                </span>
                disponible quand vous en <br />
                avez besoin.
              </h1>

              {/* Description + search */}
              <div className="bg-white/20 backdrop-blur-md p-4 md:p-6 rounded-[30px] max-w-xl border border-white/30">
                <p className="text-white text-base md:text-lg">
                  Une plateforme rapide et accessible. <br />
                  Des prestataires motivés pour vos besoins ponctuels, <br />
                  fiables et abordables.
                </p>

                {/* Search Box */}
                <div className="mt-4 w-full bg-white rounded-full flex items-center px-4 py-3 shadow-lg">
                  <input
                    type="text"
                    placeholder="recherche"
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                  />
                  <button className="text-blue-600 text-xl">⍰</button>
                </div>
              </div>
            </div>

            {/* Right-side image (man smiling) */}
            <img
              src="/images/hero-man.png"
              alt="hero person"
              className="hidden md:block absolute right-0 bottom-0 h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-28 right-20 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-5 h-5 rounded-full transition-all ${
              index === selectedIndex
                ? "bg-white/90"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
