"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const aboutImages = [
  "person-taking-measures-wood 1.png",
  "portrait-young-motivated-carpenter-standing-by-woodworking-machine-his-carpentry-workshop 1.png",
  "cropped-man-wearing-blue-overall-drawing-furniture-sheet-paper 1.png",
];

export function About() {
  const [content, setContent] = useState({
    title: "ABOUT US",
    body: "BIO CWT - We manufacture solid wood products according to individual drawings. We make chairs, armchairs, wardrobes, beds and much more in our own workshop, equipped with all the necessary industrial equipment.",
    images: aboutImages.map((name) => `/images/${name}`),
  });
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/site-content`,
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((x) => {
        if (x?.about) setContent(x.about);
      })
      .catch(() => {});
  }, []);
  return (
    <section
      className="mx-auto w-[calc(100%-20px)] max-w-[1060px] overflow-hidden rounded-r-[32px] bg-[#210b04]"
      id="about"
    >
      <div className="grid gap-8 px-6 py-12 md:grid-cols-[56%_44%] md:px-16">
        <div className="min-w-0">
          <h2 className="mb-6 text-[36px] font-medium uppercase leading-tight md:mb-12 md:text-[58px]">
            {content.title}
          </h2>
          <p className="text-base leading-relaxed md:text-lg">{content.body}</p>
        </div>
        <div className="relative h-[320px] min-w-0 sm:h-[360px] md:h-[390px]">
          {content.images.map((src, index) => (
            <Image
              key={`${src}-${index}`}
              className={`absolute object-cover rounded-lg ${
                index === 0
                  ? "right-0 top-0 h-[90px] w-[90px] sm:h-[115px] sm:w-[115px]"
                  : index === 1
                    ? "left-0 top-[60px] z-10 h-[180px] w-[180px] sm:h-[230px] sm:w-[230px]"
                    : "bottom-0 right-4 h-[90px] w-[90px] sm:h-[120px] sm:w-[120px]"
              }`}
              src={src}
              alt="BIO CWT carpenter at work"
              width={337}
              height={337}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
