import { WorkGallery } from "@/components/home/WorkGallery";
import { Materials } from "@/components/home/Materials";
import { Contact } from "@/components/home/Contact";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
async function getProducts() {
  try {
    const r = await fetch(`${API}/products`, { cache: "no-store" });
    return r.ok ? r.json() : undefined;
  } catch {
    return undefined;
  }
}
async function getImages() {
  try {
    const r = await fetch(`${API}/gallery-images`, { cache: "no-store" });
    if (!r.ok) return undefined;
    const items = await r.json();
    return items
      .filter((x: { active: boolean }) => x.active)
      .map((x: { image: string }) => x.image);
  } catch {
    return undefined;
  }
}
export default async function GalleryPage() {
  const [products, images] = await Promise.all([getProducts(), getImages()]);
  return (
    <main className="bg-lines-light">
      <WorkGallery images={images} />
      <Materials products={products} />
      <Contact />
    </main>
  );
}
