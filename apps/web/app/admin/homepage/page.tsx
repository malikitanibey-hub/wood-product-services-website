"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminMenu } from "@/components/AdminMenu";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
type Item = {
  id: string;
  title: string;
  subtitle?: string;
  body?: string;
  image?: string;
  url?: string;
  alt?: string;
  category?: string;
  active: boolean;
};
type Content = {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    backgroundImage: string;
    images: string[];
    alignment: string;
    overlay: number;
  };
  banners: Item[];
  textSections: Item[];
  images: Item[];
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

function isContent(value: unknown): value is Content {
  if (!value || typeof value !== "object") return false;
  const content = value as Partial<Content>;
  return Boolean(
    content.hero &&
    Array.isArray(content.hero.images) &&
    Array.isArray(content.banners) &&
    Array.isArray(content.textSections) &&
    Array.isArray(content.images),
  );
}

export default function HomepageManagement() {
  const [data, setData] = useState<Content | null>(null);
  const [section, setSection] = useState<
    "hero" | "banners" | "textSections" | "images"
  >("hero");
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  async function loadHomepage() {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch(`${API}/homepage`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok)
        throw new Error(`Homepage API returned ${response.status}`);
      const payload: unknown = await response.json();
      if (!isContent(payload)) throw new Error("Incomplete homepage content");
      setData(payload);
    } catch {
      setLoadError(
        "Homepage content could not be loaded. Make sure the API is running on port 4000.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadHomepage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(t);
  }, [message]);
  async function save() {
    if (!data) return;
    const r = await fetch(`${API}/homepage`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setMessage(
      r.ok
        ? "Homepage changes saved successfully."
        : "Unable to save changes. Please sign in again.",
    );
  }

  async function resetToDefaults() {
    setConfirmReset(false);
    const response = await fetch(`${API}/homepage/reset`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      setMessage("Unable to reset homepage content.");
      return;
    }
    const payload: unknown = await response.json();
    if (isContent(payload)) setData(payload);
    setMessage("Homepage was reset to its original content successfully.");
  }

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch(`${API}/homepage/upload`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      if (!response.ok) throw new Error();
      const result = (await response.json()) as { url: string };
      setMessage("Image uploaded successfully.");
      return result.url;
    } catch {
      setMessage("Image upload failed. Use JPG, PNG, WEBP, or GIF up to 5 MB.");
      return null;
    } finally {
      setUploading(false);
    }
  }
  function updateHero(key: string, value: string | number) {
    setData((d) => (d ? { ...d, hero: { ...d.hero, [key]: value } } : d));
  }
  function updateItem(
    group: "banners" | "textSections" | "images",
    id: string,
    key: string,
    value: string | boolean,
  ) {
    setData((d) =>
      d
        ? {
            ...d,
            [group]: d[group].map((x) =>
              x.id === id ? { ...x, [key]: value } : x,
            ),
          }
        : d,
    );
  }
  function addItem(group: "banners" | "textSections" | "images") {
    const base: Item = {
      id: crypto.randomUUID(),
      title: "New item",
      active: true,
    };
    if (group === "banners")
      Object.assign(base, {
        subtitle: "Banner description",
        image: "/images/image (1).png",
      });
    if (group === "textSections")
      Object.assign(base, { body: "Enter section content here." });
    if (group === "images")
      Object.assign(base, {
        url: "/images/image (1).png",
        alt: "Wood product image",
        category: "gallery",
      });
    setData((d) => (d ? { ...d, [group]: [...d[group], base] } : d));
  }
  function removeItem(
    group: "banners" | "textSections" | "images",
    id: string,
  ) {
    setData((d) =>
      d ? { ...d, [group]: d[group].filter((x) => x.id !== id) } : d,
    );
  }
  if (!data)
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f6fa] p-10 text-slate-900">
        {loading ? (
          <p className="text-lg font-medium">Loading homepage editor...</p>
        ) : (
          <section className="w-full max-w-lg rounded-xl border bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold">Homepage editor unavailable</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{loadError}</p>
            <button
              type="button"
              onClick={() => void loadHomepage()}
              className="mt-6 rounded-md bg-violet-600 px-5 py-2.5 font-semibold text-white hover:bg-violet-700"
            >
              Retry
            </button>
          </section>
        )}
      </main>
    );
  const labels = {
    hero: "Hero Section",
    banners: "Banners",
    textSections: "Text Sections",
    images: "Images",
  };
  return (
    <main
      className={`min-h-screen bg-[#f5f7fb] text-slate-800 lg:grid ${desktopSidebarOpen ? "lg:grid-cols-[250px_1fr]" : "lg:grid-cols-[1fr]"}`}
    >
      {confirmReset && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 id="reset-title" className="text-xl font-bold">
              Reset homepage content?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This restores the original hero, banners, text sections, and
              images. Your current homepage changes will be replaced.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmReset(false)}
                className="rounded-md border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => void resetToDefaults()}
                className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                Reset Homepage
              </button>
            </div>
          </div>
        </div>
      )}
      {message && (
        <div
          className={`fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg px-6 py-3 font-semibold text-white shadow-xl ${message.includes("success") ? "bg-emerald-600" : "bg-red-600"}`}
        >
          {message}
        </div>
      )}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-white/10 bg-[#101214] p-6 text-white transition-transform lg:sticky lg:top-0 lg:min-h-screen ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${desktopSidebarOpen ? "lg:translate-x-0" : "lg:hidden"}`}
      >
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-300 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <Link href="/" className="inline-block">
          <Image src="/images/logo.png" width={135} height={58} alt="BIO CWT" />
        </Link>
        <nav className="mt-8 grid gap-2 text-[15px]">
          {nav.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`rounded-[6px] px-4 py-3 ${label === "Homepage" ? "bg-[#475a73] text-white" : "text-gray-200 hover:bg-white/10"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">
        <header className="sticky top-0 z-30 flex h-[98px] items-center justify-between border-b border-white/10 bg-[#101214]/95 px-4 text-white shadow-lg backdrop-blur-md sm:px-8">
          <button
            type="button"
            onClick={() => {
              setSidebarOpen((open) => !open);
              setDesktopSidebarOpen((open) => !open);
            }}
            className="text-3xl text-gray-300"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <AdminMenu />
        </header>
        <div className="p-5 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Homepage Management</h1>
              <p className="text-sm text-slate-500">
                Edit and manage all sections of your homepage
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setConfirmReset(true)}
                className="rounded-md border border-red-200 bg-white px-4 py-2.5 font-medium text-red-600 hover:bg-red-50"
              >
                Reset Defaults
              </button>
              <Link
                target="_blank"
                href="/"
                className="rounded-md border bg-white px-5 py-2.5"
              >
                Preview Homepage
              </Link>
              <button
                onClick={save}
                className="rounded-md bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-2.5 font-semibold text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
          <div className="mt-7 grid gap-4 xl:grid-cols-[290px_1fr]">
            <aside className="rounded-lg border bg-white p-3 shadow-sm">
              <div className="p-3">
                <h2 className="font-bold">Homepage Sections</h2>
                <p className="text-xs text-slate-500">
                  Select a section to edit
                </p>
              </div>
              {(["hero", "banners", "textSections", "images"] as const).map(
                (k) => (
                  <button
                    key={k}
                    onClick={() => setSection(k)}
                    className={`flex w-full items-center justify-between rounded-md px-4 py-4 text-left ${section === k ? "bg-violet-50 text-violet-700" : "hover:bg-slate-50"}`}
                  >
                    <span className="font-medium">{labels[k]}</span>
                    {k !== "hero" && (
                      <span className="rounded-full bg-violet-100 px-2 text-xs">
                        {data[k].length}
                      </span>
                    )}
                  </button>
                ),
              )}
            </aside>
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="border-b p-5">
                <h2 className="text-lg font-bold">{labels[section]}</h2>
                <p className="text-sm text-slate-500">
                  Manage the public homepage {labels[section].toLowerCase()}
                </p>
              </div>
              {section === "hero" ? (
                <div className="grid gap-5 p-6 md:grid-cols-2">
                  {[
                    ["Title", "title"],
                    ["Subtitle", "subtitle"],
                    ["Button Text", "buttonText"],
                    ["Button Link", "buttonLink"],
                    ["Background Image", "backgroundImage"],
                  ].map(([l, k]) => (
                    <label
                      key={k}
                      className={k === "subtitle" ? "md:col-span-2" : ""}
                    >
                      <span className="mb-2 block text-sm font-medium">
                        {l}
                      </span>
                      <input
                        value={String(data.hero[k as keyof typeof data.hero])}
                        onChange={(e) => updateHero(k, e.target.value)}
                        readOnly={k === "backgroundImage"}
                        className={`w-full rounded-md border px-3 py-2.5 ${k === "backgroundImage" ? "bg-slate-50" : ""}`}
                      />
                      {k === "backgroundImage" && (
                        <label className="mt-2 block cursor-pointer rounded-md border border-violet-300 px-4 py-2 text-center text-sm font-medium text-violet-700 hover:bg-violet-50">
                          Upload background image
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            className="sr-only"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const url = await uploadImage(file);
                              if (url) updateHero("backgroundImage", url);
                            }}
                          />
                        </label>
                      )}
                    </label>
                  ))}
                  <label>
                    <span className="mb-2 block text-sm font-medium">
                      Text Alignment
                    </span>
                    <select
                      value={data.hero.alignment}
                      onChange={(e) => updateHero("alignment", e.target.value)}
                      className="w-full rounded-md border px-3 py-2.5"
                    >
                      <option>left</option>
                      <option>center</option>
                      <option>right</option>
                    </select>
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-medium">
                      Overlay: {data.hero.overlay}%
                    </span>
                    <input
                      className="w-full accent-violet-600"
                      type="range"
                      min="0"
                      max="80"
                      value={data.hero.overlay}
                      onChange={(e) =>
                        updateHero("overlay", Number(e.target.value))
                      }
                    />
                  </label>
                  <div className="md:col-span-2">
                    <p className="mb-2 text-sm font-medium">Hero Images</p>
                    {data.hero.images.map((img, i) => (
                      <div
                        key={i}
                        className="mb-3 flex flex-col gap-2 sm:flex-row"
                      >
                        <input
                          value={img}
                          readOnly
                          className="min-w-0 flex-1 rounded-md border bg-slate-50 px-3 py-2.5"
                        />
                        <label className="cursor-pointer rounded-md border border-violet-300 px-4 py-2.5 text-center text-sm font-medium text-violet-700 hover:bg-violet-50">
                          {uploading ? "Uploading..." : "Upload image"}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            className="sr-only"
                            disabled={uploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const url = await uploadImage(file);
                              if (url)
                                setData({
                                  ...data,
                                  hero: {
                                    ...data.hero,
                                    images: data.hero.images.map((x, n) =>
                                      n === i ? url : x,
                                    ),
                                  },
                                });
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <div className="mb-4 flex justify-end">
                    <button
                      onClick={() => addItem(section)}
                      className="rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      + Add New
                    </button>
                  </div>
                  <div className="space-y-4">
                    {data[section].map((item) => (
                      <article
                        key={item.id}
                        className="grid gap-3 rounded-lg border p-4 md:grid-cols-2"
                      >
                        <label>
                          <span className="text-xs">Title</span>
                          <input
                            className="w-full rounded border px-3 py-2"
                            value={item.title}
                            onChange={(e) =>
                              updateItem(
                                section,
                                item.id,
                                "title",
                                e.target.value,
                              )
                            }
                          />
                        </label>
                        {section === "banners" && (
                          <>
                            <label>
                              <span className="text-xs">Subtitle</span>
                              <input
                                className="w-full rounded border px-3 py-2"
                                value={item.subtitle}
                                onChange={(e) =>
                                  updateItem(
                                    section,
                                    item.id,
                                    "subtitle",
                                    e.target.value,
                                  )
                                }
                              />
                            </label>
                            <label className="md:col-span-2">
                              <span className="text-xs">Banner image</span>
                              <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                  className="min-w-0 flex-1 rounded border bg-slate-50 px-3 py-2"
                                  value={item.image}
                                  readOnly
                                />
                                <label className="cursor-pointer rounded border border-violet-300 px-4 py-2 text-center text-sm text-violet-700">
                                  Upload
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      const url = await uploadImage(file);
                                      if (url)
                                        updateItem(
                                          section,
                                          item.id,
                                          "image",
                                          url,
                                        );
                                    }}
                                  />
                                </label>
                              </div>
                            </label>
                          </>
                        )}
                        {section === "textSections" && (
                          <label className="md:col-span-2">
                            <span className="text-xs">Content</span>
                            <textarea
                              className="w-full rounded border px-3 py-2"
                              value={item.body}
                              onChange={(e) =>
                                updateItem(
                                  section,
                                  item.id,
                                  "body",
                                  e.target.value,
                                )
                              }
                            />
                          </label>
                        )}
                        {section === "images" && (
                          <>
                            <label>
                              <span className="text-xs">Gallery image</span>
                              <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                  className="min-w-0 flex-1 rounded border bg-slate-50 px-3 py-2"
                                  value={item.url}
                                  readOnly
                                />
                                <label className="cursor-pointer rounded border border-violet-300 px-4 py-2 text-center text-sm text-violet-700">
                                  Upload
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      const url = await uploadImage(file);
                                      if (url)
                                        updateItem(
                                          section,
                                          item.id,
                                          "url",
                                          url,
                                        );
                                    }}
                                  />
                                </label>
                              </div>
                            </label>
                            <label>
                              <span className="text-xs">Alt text</span>
                              <input
                                className="w-full rounded border px-3 py-2"
                                value={item.alt}
                                onChange={(e) =>
                                  updateItem(
                                    section,
                                    item.id,
                                    "alt",
                                    e.target.value,
                                  )
                                }
                              />
                            </label>
                          </>
                        )}
                        <div className="md:col-span-2 flex items-center justify-between">
                          <label className="flex gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={item.active}
                              onChange={(e) =>
                                updateItem(
                                  section,
                                  item.id,
                                  "active",
                                  e.target.checked,
                                )
                              }
                            />
                            Active
                          </label>
                          <button
                            onClick={() => removeItem(section, item.id)}
                            className="text-sm text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
