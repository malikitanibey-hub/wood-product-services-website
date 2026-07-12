"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminMenu } from "@/components/AdminMenu";
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
type Row = [string, string, string, string, string, string];
type Group = {
  id: number;
  name: string;
  rows: Row[];
  displayOrder: number;
  active: boolean;
};
const blank: Row = ["", "", "", "", "", ""];
export default function PriceGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]),
    [selected, setSelected] = useState<Group | null>(null),
    [name, setName] = useState(""),
    [message, setMessage] = useState(""),
    [deletingGroup, setDeletingGroup] = useState<Group | null>(null);
  async function load() {
    const r = await fetch(`${API}/price-groups`, { cache: "no-store" });
    if (r.ok) {
      const x = await r.json();
      setGroups(x);
      setSelected((s: Group | null) =>
        s ? (x.find((g: Group) => g.id === s.id) ?? x[0]) : x[0],
      );
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message]);
  async function save(group: Group) {
    const r = await fetch(`${API}/price-groups/${group.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(group),
    });
    setMessage(
      r.ok ? "Price group saved successfully." : "Unable to save price group.",
    );
    if (r.ok) await load();
  }
  async function add() {
    if (!name.trim()) return;
    const r = await fetch(`${API}/price-groups`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rows: [], displayOrder: groups.length + 1 }),
    });
    if (r.ok) {
      setName("");
      setMessage("Price group added successfully.");
      await load();
    }
  }
  async function remove() {
    if (!deletingGroup) return;
    const response = await fetch(`${API}/price-groups/${deletingGroup.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setMessage(
      response.ok
        ? "Price group deleted successfully."
        : "Unable to delete price group.",
    );
    setDeletingGroup(null);
    setSelected(null);
    await load();
  }
  function row(i: number, n: number, v: string) {
    if (!selected) return;
    const rows = selected.rows.map((r, x) =>
      x === i ? (r.map((c, y) => (y === n ? v : c)) as Row) : r,
    );
    setSelected({ ...selected, rows });
  }
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-800 lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="min-h-screen bg-[#101214] p-6 text-white">
        <Link href="/">
          <Image src="/images/logo.png" alt="BIO CWT" width={135} height={58} />
        </Link>
        <nav className="mt-8 grid gap-2">
          {[
            ["Dashboard", "/admin"],
            ["Homepage", "/admin/homepage"],
            ["Services", "/admin/services"],
            ["Products / Wood Types", "/admin/products"],
            ["About", "/admin/about"],
            ["Contact", "/admin/contact"],
            ["Login", "/admin/login"],
          ].map(([l, h]) => (
            <Link
              href={h}
              key={l}
              className={`rounded-md px-4 py-3 ${l === "Services" ? "bg-[#475a73]" : ""}`}
            >
              {l}
            </Link>
          ))}
        </nav>
      </aside>
      <section>
        <header className="sticky top-0 z-30 flex h-[98px] items-center justify-between bg-[#101214] px-8 text-white">
          <span className="text-3xl">☰</span>
          <AdminMenu />
        </header>
        <div className="p-5 md:p-8">
          {message && (
            <div className="mb-4 rounded bg-emerald-600 px-4 py-3 text-white">
              {message}
            </div>
          )}
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Services Management</h1>
              <p className="text-slate-500">
                Manage service cards and the public wood price list.
              </p>
            </div>
            <Link
              href="/prices"
              target="_blank"
              className="rounded-md border bg-white px-5 py-3"
            >
              Preview on Website
            </Link>
          </div>
          <div className="mt-7 flex border-b">
            <Link href="/admin/services" className="px-6 py-4">
              Service Cards
            </Link>
            <span className="border-b-2 border-blue-600 px-6 py-4 font-semibold text-blue-700">
              Wood Price List
            </span>
          </div>
          <div className="mt-7 grid gap-5 xl:grid-cols-[340px_1fr]">
            <aside className="rounded-lg border bg-white p-4">
              <h2 className="text-lg font-bold">Price Groups</h2>
              <div className="mt-4 flex gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Group name"
                  className="min-w-0 flex-1 rounded border px-3"
                />
                <button
                  onClick={() => void add()}
                  className="rounded bg-blue-700 px-3 py-2 text-white"
                >
                  Add
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {groups.map((g) => (
                  <div
                    key={g.id}
                    className={`flex items-center gap-2 rounded-lg border p-3 ${selected?.id === g.id ? "bg-blue-50 border-blue-300" : ""}`}
                  >
                    <button
                      onClick={() => setSelected(g)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <strong>{g.name}</strong>
                      <span className="block text-xs text-slate-500">
                        {g.rows.length} items
                      </span>
                    </button>
                    <button
                      onClick={() => setDeletingGroup(g)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </aside>
            {selected ? (
              <section className="overflow-hidden rounded-lg border bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
                  <input
                    value={selected.name}
                    onChange={(e) =>
                      setSelected({ ...selected, name: e.target.value })
                    }
                    className="rounded border px-3 py-2 font-bold"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setSelected({
                          ...selected,
                          rows: [...selected.rows, [...blank]],
                        })
                      }
                      className="rounded bg-blue-700 px-4 py-2 text-white"
                    >
                      + Add Row
                    </button>
                    <button
                      onClick={() => void save(selected)}
                      className="rounded border px-4 py-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        {[
                          "#",
                          "Length",
                          "Width",
                          "Thickness",
                          "m3",
                          "Price m3",
                          "Price item",
                          "",
                        ].map((h) => (
                          <th key={h} className="px-3 py-4 text-left">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selected.rows.map((r, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3">{i + 1}</td>
                          {r.map((c, n) => (
                            <td key={n} className="p-2">
                              <input
                                value={c}
                                onChange={(e) => row(i, n, e.target.value)}
                                className={`w-24 rounded border px-2 py-2 ${n === 5 ? "bg-orange-100" : ""}`}
                              />
                            </td>
                          ))}
                          <td>
                            <button
                              onClick={() =>
                                setSelected({
                                  ...selected,
                                  rows: selected.rows.filter((_, x) => x !== i),
                                })
                              }
                              className="text-red-600"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : (
              <div className="rounded-lg border bg-white p-8">
                Select a price group.
              </div>
            )}
          </div>
        </div>
      </section>
      {deletingGroup && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold">Delete price group?</h2>
            <p className="mt-3 text-slate-600">
              “{deletingGroup.name}” and all of its price rows will be
              permanently deleted.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeletingGroup(null)}
                className="rounded-md border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => void remove()}
                className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white"
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
