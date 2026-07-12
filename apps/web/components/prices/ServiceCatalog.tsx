import Image from "next/image";
export type PublicService = {
  id: number;
  name: string;
  shortDescription: string;
  image?: string;
  category: string;
  price?: string;
  active: boolean;
  displayOrder: number;
};
export function ServiceCatalog({ services }: { services: PublicService[] }) {
  if (!services.length) return null;
  return (
    <section className="mx-auto max-w-[1040px] px-4 pb-20 pt-10 sm:px-8">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#9dbce0]">
          What we offer
        </p>
        <h1 className="mt-2 text-[40px] font-medium uppercase tracking-wide sm:text-[54px]">
          Our services
        </h1>
        <p className="mt-3 max-w-2xl text-gray-300">
          Explore our active woodworking services and contact us for a detailed
          quotation.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#210b04] shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            {service.image ? (
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width:640px) 92vw,330px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ) : (
              <div className="flex h-52 items-center justify-center bg-white/5">
                No image
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <div className="min-h-[76px]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9dbce0]">
                  {service.category}
                </p>
                <h2 className="mt-1 text-xl font-semibold">{service.name}</h2>
              </div>
              <p className="mt-3 min-h-[84px] leading-7 text-[#e8c5a8]">
                {service.shortDescription}
              </p>
              <div className="mt-auto pt-5">
                <span className="rounded-full bg-[#7897c0]/20 px-3 py-1 text-xs font-semibold text-[#cfe1f8]">
                  {service.price || "Contact for pricing"}
                </span>
                <a
                  href="/contact#contact"
                  className="mt-4 flex w-full justify-center rounded-full bg-[#7897c0] px-5 py-2.5 text-sm font-bold"
                >
                  Request a quote
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
