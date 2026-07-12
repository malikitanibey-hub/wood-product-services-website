"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminMenu } from "@/components/AdminMenu";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
type Service = {
  id: number;
  name: string;
  shortDescription: string;
  description?: string;
  image?: string;
  category: string;
  price?: string;
  active: boolean;
  displayOrder: number;
};
const empty = {
  name: "",
  shortDescription: "",
  description: "",
  image: "",
  category: "General",
  price: "",
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

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("all"),
    [sort, setSort] = useState("order"),
    [editor, setEditor] = useState<Partial<Service> | null>(null),
    [deleting, setDeleting] = useState<Service | null>(null),
    [message, setMessage] = useState(""),
    [mobile, setMobile] = useState(false),
    [desktop, setDesktop] = useState(true),
    [uploading, setUploading] = useState(false);
  async function load() {
    const r = await fetch(`${API}/services`, { cache: "no-store" });
    if (r.ok) setItems(await r.json());
    else setMessage("Unable to load services.");
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(t);
  }, [message]);
  const shown = useMemo(
    () =>
      items
        .filter(
          (x) =>
            (status === "all" ||
              String(x.active) === (status === "active" ? "true" : "false")) &&
            (x.name + " " + x.shortDescription)
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "name"
            ? a.name.localeCompare(b.name)
            : sort === "newest"
              ? b.id - a.id
              : a.displayOrder - b.displayOrder,
        ),
    [items, query, status, sort],
  );
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!editor) return;
    const editing = Boolean(editor.id);
    const r = await fetch(`${API}/services${editing ? `/${editor.id}` : ""}`, {
      method: editing ? "PATCH" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editor),
    });
    if (r.ok) {
      setEditor(null);
      setMessage(
        editing
          ? "Service updated successfully."
          : "Service added successfully.",
      );
      await load();
    } else setMessage("Unable to save service.");
  }
  async function remove() {
    if (!deleting) return;
    const r = await fetch(`${API}/services/${deleting.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (r.ok) {
      setDeleting(null);
      setMessage("Service deleted successfully.");
      await load();
    } else setMessage("Unable to delete service.");
  }
  async function toggle(item: Service) {
    const r = await fetch(`${API}/services/${item.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    if (r.ok) await load();
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
    } else setMessage("Image upload failed.");
    setUploading(false);
  }
  const active = items.filter((x) => x.active).length,
    categories = new Set(items.map((x) => x.category)).size;
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
          className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-white/10 bg-[#101214] p-6 text-white transition-transform lg:sticky lg:top-0 lg:min-h-screen ${mobile ? "translate-x-0" : "-translate-x-full"} ${desktop ? "lg:translate-x-0" : "lg:hidden"}`}
        >
          <button
            onClick={() => setMobile(false)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="BIO CWT"
              width={135}
              height={58}
            />
          </Link>
          <nav className="mt-8 grid gap-2 text-[15px]">
            {nav.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobile(false)}
                className={`rounded-[6px] px-4 py-3 transition hover:bg-white/10 ${label === "Services" ? "bg-[#475a73]" : "text-gray-200"}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">
          <header className="sticky top-0 z-30 flex h-[98px] items-center justify-between border-b border-white/10 bg-[#101214]/95 px-5 text-white shadow-lg backdrop-blur-md sm:px-8">
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
              className={`fixed left-1/2 top-28 z-50 -translate-x-1/2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-xl ${message.includes("success") ? "bg-emerald-600" : "bg-red-600"}`}
            >
              {message}
            </div>
          )}
          <div className="p-5 md:p-8">
            <div className="mb-6 flex border-b">
              <span className="border-b-2 border-blue-600 px-6 py-4 font-semibold text-blue-700">
                Service Cards
              </span>
              <Link
                href="/admin/services/prices"
                className="px-6 py-4 font-medium text-slate-600 transition hover:text-blue-700"
              >
                Wood Price List
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Services</h1>
                <p className="mt-1 text-slate-500">
                  Create, edit and manage your services.
                </p>
              </div>
              <button
                onClick={() => setEditor({ ...empty })}
                className="rounded-lg bg-[#315ea8] px-5 py-3 font-semibold text-white shadow hover:bg-[#264d8c]"
              >
                ＋ Add New Service
              </button>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Total Services", items.length, "☷"],
                ["Active Services", active, "✓"],
                ["Inactive Services", items.length - active, "◉"],
                ["Categories", categories, "⌁"],
              ].map(([l, v, i]) => (
                <article
                  key={String(l)}
                  className="flex items-center gap-4 rounded-lg border bg-white p-5 shadow-sm"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-[#315ea8]">
                    {i}
                  </span>
                  <div>
                    <p className="text-sm text-slate-500">{l}</p>
                    <p className="text-2xl font-bold">{v}</p>
                  </div>
                </article>
              ))}
            </div>
            <section className="mt-6 overflow-hidden rounded-lg border bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:justify-between">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services..."
                  className="rounded-md border px-4 py-2.5 lg:w-72"
                />
                <div className="flex gap-3">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="min-w-36 rounded-md border px-3"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="min-w-40 rounded-md border px-3"
                  >
                    <option value="order">Sort by: Order</option>
                    <option value="newest">Sort by: Newest</option>
                    <option value="name">Sort by: Name</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      {[
                        "#",
                        "Image",
                        "Service Name",
                        "Short Description",
                        "Price",
                        "Status",
                        "Order",
                        "Actions",
                      ].map((h) => (
                        <th key={h} className="px-5 py-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((x) => (
                      <tr key={x.id} className="border-t hover:bg-slate-50">
                        <td className="px-5 py-4">{x.id}</td>
                        <td className="px-5 py-3">
                          {x.image ? (
                            <Image
                              src={x.image}
                              alt=""
                              width={92}
                              height={58}
                              className="h-14 w-24 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-14 w-24 rounded bg-slate-100" />
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold">
                          {x.name}
                          <span className="mt-1 block text-xs font-normal text-slate-400">
                            {x.category}
                          </span>
                        </td>
                        <td className="max-w-xs px-5 py-4 text-slate-600">
                          {x.shortDescription}
                        </td>
                        <td className="px-5 py-4">{x.price || "—"}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => void toggle(x)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${x.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                          >
                            {x.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-5 py-4">{x.displayOrder}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditor({ ...x })}
                              className="rounded-md border border-blue-300 px-3 py-2 text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleting(x)}
                              className="rounded-md border border-red-300 px-3 py-2 text-red-600"
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
              <div className="border-t px-5 py-4 text-sm text-slate-500">
                Showing {shown.length} of {items.length} services
              </div>
            </section>
          </div>
        </section>
      </div>
      {editor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <form
            onSubmit={submit}
            className="my-8 w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editor.id ? "Edit Service" : "Add New Service"}
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
              <label className="sm:col-span-2">
                <span className="text-sm font-medium">Service Name</span>
                <input
                  required
                  value={editor.name}
                  onChange={(e) =>
                    setEditor({ ...editor, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border px-3 py-2.5"
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-medium">Short Description</span>
                <textarea
                  required
                  value={editor.shortDescription}
                  onChange={(e) =>
                    setEditor({ ...editor, shortDescription: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border px-3 py-2.5"
                />
              </label>
              <label>
                <span className="text-sm font-medium">Category</span>
                <input
                  value={editor.category}
                  onChange={(e) =>
                    setEditor({ ...editor, category: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border px-3 py-2.5"
                />
              </label>
              <label>
                <span className="text-sm font-medium">Price</span>
                <input
                  value={editor.price}
                  onChange={(e) =>
                    setEditor({ ...editor, price: e.target.value })
                  }
                  placeholder="From 1,700 CZK"
                  className="mt-1 w-full rounded-md border px-3 py-2.5"
                />
              </label>
              <label>
                <span className="text-sm font-medium">Display Order</span>
                <input
                  type="number"
                  value={editor.displayOrder}
                  onChange={(e) =>
                    setEditor({
                      ...editor,
                      displayOrder: Number(e.target.value),
                    })
                  }
                  className="mt-1 w-full rounded-md border px-3 py-2.5"
                />
              </label>
              <label className="flex items-end gap-2 pb-2">
                <input
                  type="checkbox"
                  checked={editor.active}
                  onChange={(e) =>
                    setEditor({ ...editor, active: e.target.checked })
                  }
                />{" "}
                Active service
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-medium">Service Image</span>
                <div className="mt-1 flex gap-3">
                  <input
                    value={editor.image}
                    readOnly
                    className="min-w-0 flex-1 rounded-md border bg-slate-50 px-3"
                  />
                  <label className="cursor-pointer rounded-md border border-blue-300 px-4 py-2.5 text-blue-700">
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
                className="rounded-md border px-4 py-2.5"
              >
                Cancel
              </button>
              <button className="rounded-md bg-[#315ea8] px-5 py-2.5 font-semibold text-white">
                Save Service
              </button>
            </div>
          </form>
        </div>
      )}
      {deleting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h2 className="text-xl font-bold">Delete service?</h2>
            <p className="mt-3 text-slate-600">
              This will permanently delete “{deleting.name}”.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="rounded-md border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => void remove()}
                className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white"
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
