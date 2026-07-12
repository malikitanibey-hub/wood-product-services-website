"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const defaultSlides = [
  "/images/modern-wooden-kitchen-interior-steel-kitchen-faucet 2.png",
  "/images/frames-for-your-heart-JDBVXignFdA-unsplash.jpg",
  "/images/sergei-sushchik-DQpUeNzRj6s-unsplash.jpg",
];

export function WorkGallery({ images = defaultSlides }: { images?: string[] }) {
  const slides = images.length ? images : defaultSlides;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      2000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const move = (direction: number) => {
    setActive(
      (current) => (current + direction + slides.length) % slides.length,
    );
  };

  return (
    <section className="mx-auto max-w-[1000px] px-3 py-16 md:px-12" id="work">
      <h2 className="mb-14 text-[42px] font-medium uppercase md:text-[58px]">
        Our work
      </h2>
      <div className="grid grid-cols-[36px_1fr_36px] items-center">
        <button
          className="h-full text-3xl text-[#a9c2de]"
          type="button"
          onClick={() => move(-1)}
          aria-label="Previous project"
        >
          &larr;
        </button>
        <div className="relative h-[240px] overflow-hidden rounded-[28px] sm:h-[380px] md:h-[500px]">
          <Image
            className="object-cover"
            key={active}
            src={slides[active]}
            alt="Wood interior project"
            fill
            priority
            sizes="(max-width: 800px) 86vw, 860px"
          />
        </div>
        <button
          className="h-full text-3xl text-[#a9c2de]"
          type="button"
          onClick={() => move(1)}
          aria-label="Next project"
        >
          &rarr;
        </button>
      </div>
      <div
        className="mt-4 flex justify-center gap-2"
        aria-label="Choose gallery slide"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`h-3 w-3 rounded-full border-2 border-[#9dbce0] ${index === active ? "bg-[#9dbce0]" : "bg-[#202020]"}`}
            onClick={() => setActive(index)}
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
