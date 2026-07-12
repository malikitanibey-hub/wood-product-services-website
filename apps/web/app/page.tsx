import { Hero } from "@/components/home/Hero";
import { Materials } from "@/components/home/Materials";
import { WorkGallery } from "@/components/home/WorkGallery";
import { Advantages } from "@/components/home/Advantages";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { CmsBanners } from "@/components/home/CmsBanners";
import { CmsTextSections } from "@/components/home/CmsTextSections";

const API =
  process.env.SERVER_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000/api";

async function getHomepage() {
  try {
    const response = await fetch(`${API}/homepage`, { cache: "no-store" });
    return response.ok ? response.json() : null;
  } catch {
    return null;
  }
}
async function getGalleryImages() {
  try {
    const response = await fetch(`${API}/gallery-images`, {
      cache: "no-store",
    });
    if (!response.ok) return undefined;
    const items = await response.json();
    return items
      .filter((item: { active: boolean }) => item.active)
      .map((item: { image: string }) => item.image);
  } catch {
    return undefined;
  }
}

export default async function HomePage() {
  const content = await getHomepage();
  const sharedGallery = await getGalleryImages();
  const gallery = content?.images
    ?.filter(
      (item: { active: boolean; category: string }) =>
        item.active && item.category === "gallery",
    )
    .map((item: { url: string }) => item.url);
  return (
    <main>
      <Hero content={content?.hero} />
      <CmsBanners banners={content?.banners} />
      <CmsTextSections sections={content?.textSections} />
      <Materials />
      <WorkGallery images={sharedGallery?.length ? sharedGallery : gallery} />
      <Advantages />
      <About />
      <Contact />
    </main>
  );
}
