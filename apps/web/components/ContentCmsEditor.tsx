"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminMenu } from "@/components/AdminMenu";
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const nav = [
  ["Dashboard", "/admin"],
  ["Homepage", "/admin/homepage"],
  ["Services", "/admin/services"],
  ["Products / Wood Types", "/admin/products"],
  ["About", "/admin/about"],
  ["Contact", "/admin/contact"],
  ["Login", "/admin/login"],
];
const fields = {
  about: [
    ["title", "Section Title"],
    ["body", "About Content"],
  ],
  contact: [
    ["title", "Section Title"],
    ["description", "Section Description"],
    ["namePlaceholder", "Name Field Placeholder"],
    ["phonePlaceholder", "Phone Field Placeholder"],
    ["questionPlaceholder", "Question Field Placeholder"],
    ["buttonText", "Form Button Text"],
    ["successTitle", "Success Title"],
    ["successMessage", "Success Message"],
    ["contactTitle", "Contact Information Title"],
    ["phoneLabel", "Phone Label"],
    ["phone", "Phone Number"],
    ["addressLabel", "Address Label"],
    ["address", "Address"],
    ["hoursLabel", "Working Hours Label"],
    ["hours", "Working Hours"],
    ["mapUrl", "Map Embed URL"],
  ],
  login: [
    ["title", "Login Box Title"],
    ["subtitle", "Login Box Subtitle"],
    ["emailLabel", "Email Label"],
    ["passwordLabel", "Password Label"],
    ["buttonText", "Sign In Button Text"],
    ["footerText", "Footer Text"],
  ],
} as const;
export function ContentCmsEditor({
  section,
}: {
  section: keyof typeof fields;
}) {
  const [data, setData] = useState<Record<string, any>>({}),
    [loading, setLoading] = useState(true),
    [message, setMessage] = useState(""),
    [confirmReset, setConfirmReset] = useState(false),
    [uploading, setUploading] = useState(false),
    [mobileSidebarOpen, setMobileSidebarOpen] = useState(false),
    [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  async function upload(file: File, key: string, index?: number) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const r = await fetch(`${API}/homepage/upload`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    if (r.ok) {
      const x = await r.json();
      if (index === undefined) setData({ ...data, [key]: x.url });
      else {
        const images = [...(data.images ?? [])];
        images[index] = x.url;
        setData({ ...data, images });
      }
      setMessage("Image uploaded successfully.");
    } else setMessage("Image upload failed.");
    setUploading(false);
  }
  async function load() {
    setLoading(true);
    const r = await fetch(`${API}/site-content`, { cache: "no-store" });
    if (r.ok) {
      const x = await r.json();
      setData(x[section] ?? {});
    }
    setLoading(false);
  }
  useEffect(() => {
    void load();
  }, [section]);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(t);
  }, [message]);
  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);
  async function save() {
    const r = await fetch(`${API}/site-content/${section}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setMessage(
      r.ok ? "Changes saved successfully." : "Unable to save changes.",
    );
  }
  async function reset() {
    setConfirmReset(false);
    const r = await fetch(`${API}/site-content/${section}/reset`, {
      method: "POST",
      credentials: "include",
    });
    if (r.ok) {
      setMessage("Content reset successfully.");
      await load();
    }
  }
  const title =
    section === "about"
      ? "About Us Management"
      : section === "contact"
        ? "Contact Management"
        : "Login Management (CMS)";
  return (
    <main
      className={`min-h-screen bg-[#f5f7fb] text-slate-800 xl:grid ${desktopSidebarOpen ? "xl:grid-cols-[250px_1fr]" : "xl:grid-cols-[1fr]"}`}
    >
      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[70] bg-black/65 xl:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-[80] flex h-dvh max-h-dvh
w-[min(280px,82vw)] flex-col overflow-y-auto
bg-[#101214] p-6 text-white transition-transform duration-300
xl:sticky xl:top-0 xl:h-screen xl:w-[250px]
${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
${desktopSidebarOpen ? "xl:translate-x-0" : "xl:hidden"}`}
      >
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-300 hover:bg-white/10 xl:hidden"
          aria-label="Close sidebar"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <Link href="/">
          <Image src="/images/logo.png" width={135} height={58} alt="BIO CWT" />
        </Link>
        <nav className="mt-8 grid gap-2">
          {nav.map(([l, h]) => (
            <Link
              key={l}
              href={h}
              onClick={() => setMobileSidebarOpen(false)}
              className={`rounded-md px-4 py-3 ${h === `/admin/${section}` ? "bg-[#475a73]" : "hover:bg-white/10"}`}
            >
              {l}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">
        <header className="sticky top-0 z-30 flex h-[98px] items-center justify-between bg-[#101214] px-8 text-white">
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1280)
                setMobileSidebarOpen((open) => !open);
              else setDesktopSidebarOpen((open) => !open);
            }}
            className="text-3xl text-gray-300"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <AdminMenu />
        </header>
        {message && (
          <div className="fixed left-1/2 top-28 z-50 -translate-x-1/2 rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white">
            {message}
          </div>
        )}
        <div className="p-5 md:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="mt-1 text-slate-500">
                Edit content displayed across the public website.
              </p>
            </div>
            <Link
              href={
                section === "login"
                  ? "/login"
                  : section === "about"
                    ? "/about"
                    : "/contact"
              }
              target="_blank"
              className="h-fit rounded-md border bg-white px-5 py-3"
            >
              Preview on Website
            </Link>
          </div>
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <span className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
            </div>
          ) : (
            <div className="mt-7 rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Edit {section[0].toUpperCase() + section.slice(1)} Content
              </h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {fields[section].map(([key, label]) => (
                  <label
                    key={key}
                    className={
                      key === "body" ||
                      key === "description" ||
                      key === "successMessage"
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    <span className="text-sm font-medium">{label}</span>
                    {key === "body" ||
                    key === "description" ||
                    key === "successMessage" ? (
                      <textarea
                        rows={5}
                        value={data[key] ?? ""}
                        onChange={(e) =>
                          setData({ ...data, [key]: e.target.value })
                        }
                        className="mt-1 w-full rounded-md border px-3 py-2.5"
                      />
                    ) : (
                      <input
                        value={data[key] ?? ""}
                        onChange={(e) =>
                          setData({ ...data, [key]: e.target.value })
                        }
                        className="mt-1 w-full rounded-md border px-3 py-2.5"
                      />
                    )}
                  </label>
                ))}
              </div>
              {section === "about" && (
                <div className="mt-6">
                  <h3 className="font-bold">About Images (3)</h3>
                  <div className="mt-3 grid gap-4 md:grid-cols-3">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="rounded-lg border p-3">
                        {data.images?.[index] && (
                          <div className="relative h-36 overflow-hidden rounded-md">
                            <Image
                              src={data.images[index]}
                              alt={`About image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <label className="mt-3 block cursor-pointer rounded-md border border-blue-300 px-3 py-2 text-center text-sm text-blue-700">
                          {uploading
                            ? "Uploading..."
                            : `Change image ${index + 1}`}
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void upload(file, "images", index);
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {section === "contact" && (
                <div className="mt-6">
                  <h3 className="font-bold">Contact Form Image</h3>
                  {data.formImage && (
                    <div className="relative mt-3 h-44 w-44 overflow-hidden rounded-lg">
                      <Image
                        src={data.formImage}
                        alt="Contact decoration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <label className="mt-3 inline-block cursor-pointer rounded-md border border-blue-300 px-4 py-2 text-blue-700">
                    Change Contact Image
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void upload(file, "formImage");
                      }}
                    />
                  </label>
                </div>
              )}
              {section === "login" && (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {[
                    ["backgroundImage", "Login Background"],
                    ["decorativeImage", "Decorative Image"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <h3 className="font-bold">{label}</h3>
                      {data[key] && (
                        <div className="relative mt-3 h-44 overflow-hidden rounded-lg">
                          <Image
                            src={data[key]}
                            alt={label}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <label className="mt-3 inline-block cursor-pointer rounded-md border border-blue-300 px-4 py-2 text-blue-700">
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void upload(file, key);
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => void save()}
                  className="rounded-md bg-blue-700 px-5 py-2.5 font-semibold text-white"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setConfirmReset(true)}
                  className="rounded-md border px-5 py-2.5"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      {confirmReset && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h2 className="text-xl font-bold">Reset content?</h2>
            <p className="mt-3 text-slate-600">
              Your current changes will be replaced by the original content.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmReset(false)}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => void reset()}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
