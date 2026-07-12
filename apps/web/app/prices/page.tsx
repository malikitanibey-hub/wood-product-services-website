import { Contact } from "@/components/home/Contact";
import { PriceCarousel, PriceGroup } from "@/components/prices/PriceCarousel";
import {
  PublicService,
  ServiceCatalog,
} from "@/components/prices/ServiceCatalog";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function getServices(): Promise<PublicService[]> {
  try {
    const response = await fetch(`${API}/services`, { cache: "no-store" });
    if (!response.ok) return [];
    const services = (await response.json()) as PublicService[];
    return services
      .filter((service) => service.active)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  } catch {
    return [];
  }
}
async function getPriceGroups(): Promise<PriceGroup[]> {
  try {
    const response = await fetch(`${API}/price-groups`, { cache: "no-store" });
    if (!response.ok) return [];
    const groups = (await response.json()) as Array<{
      name: string;
      rows: PriceGroup["rows"];
      active: boolean;
    }>;
    return groups
      .filter((group) => group.active)
      .map((group) => ({ material: group.name, rows: group.rows }));
  } catch {
    return [];
  }
}

export default async function PricesPage() {
  const services = await getServices();
  const priceGroups = await getPriceGroups();
  return (
    <main>
      <ServiceCatalog services={services} />
      <section className="mx-auto max-w-[900px] px-4 pb-12 pt-10 sm:px-8">
        <h2 className="mb-14 px-10 text-[42px] font-medium uppercase tracking-wide sm:text-[54px]">
          Wood price list
        </h2>
        <PriceCarousel groups={priceGroups} />
      </section>
      <Contact />
    </main>
  );
}
