import Image from "next/image";
import Link from "next/link";

const defaultImages = [
  "/images/image (1).png",
  "/images/image (2).png",
  "/images/image (3).png",
];

export function Hero({
  content,
}: {
  content?: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    backgroundImage: string;
    images: string[];
    alignment: string;
    overlay: number;
  };
}) {
  const hero = content ?? {
    title: "SOLID WOOD PRODUCTS",
    subtitle: "Oak, beech, ash from 1700 CZK per m3",
    buttonText: "Order",
    buttonLink: "/contact#contact",
    backgroundImage: "/images/imag.png",
    images: defaultImages,
    alignment: "left",
    overlay: 40,
  };
  return (
    <section
      className="bg-cover bg-center px-4 py-12 md:px-6 md:py-16"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,${hero.overlay / 100}),rgba(0,0,0,${hero.overlay / 100})),url('${hero.backgroundImage}')`,
      }}
      id="home"
    >
      <div className="mx-auto w-full max-w-[1100px] rounded-[28px] bg-[#210b04]/95 px-5 py-8 shadow-2xl md:px-10 md:py-12">
        <div className="mx-auto grid grid-cols-1 items-center gap-6 sm:grid-cols-[44%_1px_56%] sm:gap-0 md:min-h-[480px]">
          <div className="min-w-0 px-4 sm:px-8">
            <h1 className="whitespace-pre-line text-[36px] font-semibold uppercase leading-[0.98] tracking-tight text-white sm:text-[48px] md:text-[64px] lg:text-[82px]">
              {hero.title}
            </h1>
            <p className="mt-6 whitespace-pre-line text-[15px] text-[#e8c5a8] md:text-[16px]">
              {hero.subtitle}
            </p>
            <div className="mt-6">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-[#7897c0] px-6 py-2.5 text-base font-bold shadow-md hover:bg-[#8ba8ce]"
                href={hero.buttonLink}
              >
                {hero.buttonText}
              </Link>
            </div>
          </div>

          {/* vertical divider (visible on sm+) */}
          <div className="hidden sm:flex justify-center">
            <div className="h-[70%] w-px bg-white/10" aria-hidden />
          </div>

          <div className="relative h-[260px] min-w-0 sm:h-[360px] md:h-[440px]">
            {hero.images.map((src, index) => (
              <Image
                key={`${src}-${index}`}
                className={`absolute object-cover rounded-[16px] shadow-lg ${
                  index === 0
                    ? "right-6 top-6 h-[92px] w-[92px] sm:h-[110px] sm:w-[110px] md:h-[132px] md:w-[132px]"
                    : index === 1
                      ? "left-8 top-[86px] z-10 h-[160px] w-[160px] sm:left-10 sm:top-[100px] sm:h-[200px] sm:w-[200px] md:h-[230px] md:w-[230px]"
                      : "bottom-0 right-6 h-[92px] w-[92px] sm:h-[110px] sm:w-[110px] md:h-[132px] md:w-[132px]"
                }`}
                src={src}
                alt="Solid wood interior detail"
                width={205}
                height={205}
                priority
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
