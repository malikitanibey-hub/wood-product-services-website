import Image from "next/image";
type Banner = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  active: boolean;
};
export function CmsBanners({ banners = [] }: { banners?: Banner[] }) {
  const visible = banners.filter((banner) => banner.active);
  if (!visible.length) return null;
  return (
    <section
      className="mx-auto grid max-w-[1000px] gap-5 px-6 py-16 md:grid-cols-3 md:px-12"
      aria-label="Homepage banners"
    >
      {visible.map((banner) => (
        <article
          key={banner.id}
          className="group overflow-hidden rounded-2xl bg-[#210b04] shadow-xl transition-all duration-300 ease-out hover:-translate-y-3 hover:shadow-[0_22px_45px_rgba(0,0,0,.45)]"
        >
          {banner.image && (
            <div className="relative h-44 overflow-hidden">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 90vw, 300px"
              />
            </div>
          )}
          <div className="p-5 transition-colors duration-300 group-hover:bg-[#321309]">
            <h2 className="text-xl font-semibold transition-colors group-hover:text-[#f0b488]">{banner.title}</h2>
            {banner.subtitle && (
              <p className="mt-2 text-sm leading-6 text-[#e8c5a8]">
                {banner.subtitle}
              </p>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
