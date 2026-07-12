"use client";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminMenu } from "@/components/AdminMenu";
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
type Product = {
  id: number;
  name: string;
  category: string;
  image?: string;
  characteristics: string[];
  active: boolean;
  displayOrder: number;
};
const empty = {
  name: "",
  category: "Hardwood",
  image: "",
  characteristics: [] as string[],
  active: true,
  displayOrder: 0,
};
const nav = [
  ["Dashboard", "/admin"],
  ["Homepage", "/admin/homepage"],
  ["Services", "/admin/services"],
  ["Products / Wood Types", "/admin/products"],
  ["About", "/admin/about"],
  ["Contact", "/admin/contact"],
  ["Login", "/admin/login"],
];
export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]),
    [loading, setLoading] = useState(true),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("all"),
    [status, setStatus] = useState("all"),
    [editor, setEditor] = useState<Partial<Product> | null>(null),
    [deleting, setDeleting] = useState<Product | null>(null),
    [message, setMessage] = useState(""),
    [mobile, setMobile] = useState(false),
    [desktop, setDesktop] = useState(true),
    [uploading, setUploading] = useState(false),
    [feature, setFeature] = useState(""),
    [featurePositive, setFeaturePositive] = useState(true);
  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`${API}/products`, { cache: "no-store" });
      if (!r.ok) throw 0;
      setItems(await r.json());
    } catch {
      setMessage("Unable to load products. Restart the API and try again.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(t);
  }, [message]);
  const categories = useMemo(
    () => Array.from(new Set(items.map((x) => x.category))),
    [items],
  );
  const shown = items.filter(
    (x) =>
      (category === "all" || x.category === category) &&
      (status === "all" || x.active === (status === "active")) &&
      (x.name + " " + x.characteristics.join(" "))
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!editor) return;
    const edit = Boolean(editor.id),
      r = await fetch(`${API}/products${edit ? `/${editor.id}` : ""}`, {
        method: edit ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editor),
      });
    setMessage(
      r.ok
        ? `Product ${edit ? "updated" : "added"} successfully.`
        : "Unable to save product.",
    );
    if (r.ok) {
      setEditor(null);
      await load();
    }
  }
  async function remove() {
    if (!deleting) return;
    const r = await fetch(`${API}/products/${deleting.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setMessage(
      r.ok ? "Product deleted successfully." : "Unable to delete product.",
    );
    if (r.ok) {
      setDeleting(null);
      await load();
    }
  }
  async function toggle(x: Product) {
    await fetch(`${API}/products/${x.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !x.active }),
    });
    await load();
  }
  async function upload(file: File) {
    setUploading(true);
    const f = new FormData();
    f.append("file", file);
    const r = await fetch(`${API}/homepage/upload`, {
      method: "POST",
      credentials: "include",
      body: f,
    });
    if (r.ok) {
      const x = await r.json();
      setEditor((v) => (v ? { ...v, image: x.url } : v));
      setMessage("Image uploaded successfully.");
    } else setMessage("Image upload failed.");
    setUploading(false);
  }
  function addFeature() {
    if (!feature.trim() || !editor) return;
    setEditor({
      ...editor,
      characteristics: [
        ...(editor.characteristics ?? []),
        `${featurePositive ? "+" : "-"}${feature.trim()}`,
      ],
    });
    setFeature("");
  }
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div
        className={`grid min-h-screen ${desktop ? "lg:grid-cols-[250px_1fr]" : "lg:grid-cols-[1fr]"}`}
      >
        {mobile && (
          <button
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setMobile(false)}
            aria-label="Close sidebar"
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col bg-[#101214] p-6 text-white transition-transform lg:sticky lg:top-0 lg:min-h-screen ${mobile ? "translate-x-0" : "-translate-x-full"} ${desktop ? "lg:translate-x-0" : "lg:hidden"}`}
        >
          <button
            onClick={() => setMobile(false)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 lg:hidden"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
          <Link href="/">
            <Image
              src="/images/logo.png"
              width={135}
              height={58}
              alt="BIO CWT"
            />
          </Link>
          <nav className="mt-8 grid gap-2">
            {nav.map(([l, h]) => (
              <Link
                key={l}
                href={h}
                onClick={() => setMobile(false)}
                className={`rounded-md px-4 py-3 ${l === "Products / Wood Types" ? "bg-[#475a73]" : "hover:bg-white/10"}`}
              >
                {l}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">
          <header className="sticky top-0 z-30 flex h-[98px] items-center justify-between bg-[#101214]/95 px-5 text-white shadow-lg sm:px-8">
            <button
              onClick={() => {
                setMobile((v) => !v);
                setDesktop((v) => !v);
              }}
              className="text-3xl text-gray-300"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <AdminMenu />
          </header>
          {message && (
            <div
              className={`fixed left-1/2 top-28 z-50 -translate-x-1/2 rounded-lg px-5 py-3 font-semibold text-white ${message.includes("success") ? "bg-emerald-600" : "bg-red-600"}`}
            >
              {message}
            </div>
          )}
          <div className="p-5 md:p-8">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Wood Types / Products</h1>
                <p className="mt-1 text-slate-500">
                  Create, edit and manage wood types shown on the website.
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/gallery"
                  target="_blank"
                  className="rounded-md border bg-white px-5 py-3"
                >
                  Preview on Website
                </Link>
                <button
                  onClick={() =>
                    setEditor({ ...empty, displayOrder: items.length + 1 })
                  }
                  className="rounded-md bg-blue-700 px-5 py-3 font-semibold text-white"
                >
                  ＋ Add New Product
                </button>
              </div>
            </div>
            {loading ? (
              <div className="flex min-h-[420px] items-center justify-center">
                <div className="text-center">
                  <span className="mx-auto block h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
                  <p className="mt-4 font-medium text-slate-500">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Total Products", items.length],
                    ["Active Products", items.filter((x) => x.active).length],
                    [
                      "Inactive Products",
                      items.filter((x) => !x.active).length,
                    ],
                    ["Categories", categories.length],
                  ].map(([l, v]) => (
                    <article
                      key={String(l)}
                      className="rounded-lg border bg-white p-5"
                    >
                      <p className="text-sm text-slate-500">{l}</p>
                      <p className="mt-1 text-2xl font-bold">{v}</p>
                    </article>
                  ))}
                </div>
                <div className="mt-6 grid gap-5 xl:grid-cols-[260px_1fr]">
                  <aside className="rounded-lg border bg-white p-4">
                    <h2 className="font-bold">Categories</h2>
                    <button
                      onClick={() => setCategory("all")}
                      className={`mt-4 w-full rounded p-3 text-left ${category === "all" ? "bg-blue-50 text-blue-700" : ""}`}
                    >
                      All Categories{" "}
                      <span className="float-right">{items.length}</span>
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`w-full rounded p-3 text-left ${category === c ? "bg-blue-50 text-blue-700" : ""}`}
                      >
                        {c}
                        <span className="float-right">
                          {items.filter((x) => x.category === c).length}
                        </span>
                      </button>
                    ))}
                    <h3 className="mt-6 font-bold">Filters</h3>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-3 w-full rounded border px-3 py-2"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </aside>
                  <section className="overflow-hidden rounded-lg border bg-white">
                    <div className="border-b p-4">
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full max-w-sm rounded border px-4 py-2.5"
                      />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            {[
                              "#",
                              "Image",
                              "Name",
                              "Category",
                              "Characteristics",
                              "Status",
                              "Order",
                              "Actions",
                            ].map((h) => (
                              <th key={h} className="px-4 py-4 text-left">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {shown.map((x) => (
                            <tr key={x.id} className="border-t">
                              <td className="px-4">{x.id}</td>
                              <td className="p-3">
                                {x.image && (
                                  <Image
                                    src={x.image}
                                    width={64}
                                    height={64}
                                    alt=""
                                    className="h-16 w-16 rounded-xl object-cover"
                                  />
                                )}
                              </td>
                              <td className="px-4 font-semibold">{x.name}</td>
                              <td className="px-4">
                                <span className="rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                                  {x.category}
                                </span>
                              </td>
                              <td className="px-4">
                                {x.characteristics.map((c) => (
                                  <span key={c} className="block">
                                    ✓ {c}
                                  </span>
                                ))}
                              </td>
                              <td className="px-4">
                                <button
                                  onClick={() => void toggle(x)}
                                  className={`rounded-full px-3 py-1 text-xs ${x.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200"}`}
                                >
                                  {x.active ? "Active" : "Inactive"}
                                </button>
                              </td>
                              <td className="px-4">{x.displayOrder}</td>
                              <td className="px-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setEditor({ ...x })}
                                    className="rounded border border-blue-300 px-3 py-2 text-blue-700"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => setDeleting(x)}
                                    className="rounded border border-red-300 px-3 py-2 text-red-600"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      {editor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <form
            onSubmit={submit}
            className="my-8 w-full max-w-2xl rounded-xl bg-white p-6"
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">
                {editor.id ? "Edit Product" : "Add Product"}
              </h2>
              <button
                type="button"
                onClick={() => setEditor(null)}
                className="text-2xl"
              >
                ×
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label>
                <span>Name</span>
                <input
                  required
                  value={editor.name}
                  onChange={(e) =>
                    setEditor({ ...editor, name: e.target.value })
                  }
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </label>
              <label>
                <span>Category</span>
                <input
                  required
                  value={editor.category}
                  onChange={(e) =>
                    setEditor({ ...editor, category: e.target.value })
                  }
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </label>
              <label>
                <span>Display Order</span>
                <input
                  type="number"
                  value={editor.displayOrder}
                  onChange={(e) =>
                    setEditor({
                      ...editor,
                      displayOrder: Number(e.target.value),
                    })
                  }
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </label>
              <label className="flex items-end gap-2 pb-2">
                <input
                  type="checkbox"
                  checked={editor.active}
                  onChange={(e) =>
                    setEditor({ ...editor, active: e.target.checked })
                  }
                />
                Active
              </label>
              <div className="sm:col-span-2">
                <span>Characteristics</span>
                <div
                  className="mt-2 flex gap-2"
                  aria-label="Characteristic type"
                >
                  <button
                    type="button"
                    onClick={() => setFeaturePositive(true)}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${featurePositive ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "text-slate-500"}`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 font-bold">
                      ✓
                    </span>{" "}
                    Advantage
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeaturePositive(false)}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${!featurePositive ? "border-red-500 bg-red-50 text-red-700" : "text-slate-500"}`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 font-bold">
                      ×
                    </span>{" "}
                    Disadvantage
                  </button>
                </div>
                <div className="mt-1 flex gap-2">
                  <input
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    className="flex-1 rounded border px-3"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="rounded bg-slate-800 px-4 py-2 text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {editor.characteristics?.map((c, i) => (
                    <button
                      type="button"
                      key={`${c}-${i}`}
                      onClick={() =>
                        setEditor({
                          ...editor,
                          characteristics: editor.characteristics?.filter(
                            (_, x) => x !== i,
                          ),
                        })
                      }
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                    >
                      <span
                        className={
                          c.startsWith("-")
                            ? "text-red-600"
                            : "text-emerald-600"
                        }
                      >
                        {c.startsWith("-") ? "×" : "✓"}
                      </span>{" "}
                      {c.startsWith("+") || c.startsWith("-") ? c.slice(1) : c}{" "}
                      <span className="text-slate-400">×</span>
                    </button>
                  ))}
                </div>
              </div>
              <label className="sm:col-span-2">
                <span>Product Image</span>
                <div className="mt-1 flex gap-2">
                  <input
                    value={editor.image}
                    readOnly
                    className="flex-1 rounded border bg-slate-50 px-3"
                  />
                  <label className="cursor-pointer rounded border px-4 py-2">
                    {uploading ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void upload(f);
                      }}
                    />
                  </label>
                </div>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditor(null)}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>
              <button className="rounded bg-blue-700 px-5 py-2 text-white">
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
      {deleting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h2 className="text-xl font-bold">Delete product?</h2>
            <p className="mt-3 text-slate-600">
              “{deleting.name}” will be permanently deleted.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => void remove()}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
