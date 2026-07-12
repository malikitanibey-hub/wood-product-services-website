"use client";
import { useState } from "react";
export type PriceRow = [string, string, string, string, string, string];
export type PriceGroup = { material: string; rows: PriceRow[] };
export function PriceCarousel({ groups }: { groups: PriceGroup[] }) {
  const [active, setActive] = useState(0);
  if (!groups.length) return null;
  const move = (n: number) =>
      setActive((x) => (x + n + groups.length) % groups.length),
    group = groups[active];
  return (
    <div>
      <div className="grid grid-cols-[30px_1fr_30px] items-center gap-2">
        <button
          className="text-4xl text-[#9dbce0]"
          onClick={() => move(-1)}
          aria-label="Previous prices"
        >
          ‹
        </button>
        <div className="overflow-x-auto rounded-[22px] bg-[#dedede] text-[#111]">
          <div className="grid min-w-[700px] grid-cols-[.5fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-[#cfd8e4] px-4 py-4 text-sm font-bold">
            <span>#</span>
            <span>Délka</span>
            <span>Šířka</span>
            <span>Tloušťka</span>
            <span>m3</span>
            <span>Cena m3</span>
            <span>Cena ks.</span>
          </div>
          {group.rows.map((row, i) => (
            <div
              key={i}
              className="grid min-w-[700px] grid-cols-[.5fr_1fr_1fr_1fr_1fr_1fr_1fr] border-t border-[#c7bdb8] px-4 py-4 text-sm"
            >
              <strong>{i + 1}</strong>
              {row.map((cell, n) => (
                <span
                  key={n}
                  className={n === 5 ? "rounded bg-[#e89375] px-2 py-1" : ""}
                >
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
        <button
          className="text-4xl text-[#9dbce0]"
          onClick={() => move(1)}
          aria-label="Next prices"
        >
          ›
        </button>
      </div>
      <h3 className="mt-4 text-center text-xl font-semibold uppercase">
        {group.material}
      </h3>
      <div className="mt-5 flex justify-center gap-2">
        {groups.map((g, i) => (
          <button
            key={g.material}
            onClick={() => setActive(i)}
            className={`h-3 w-3 rounded-full border-2 border-[#9dbce0] ${i === active ? "bg-[#9dbce0]" : ""}`}
            aria-label={`Show ${g.material}`}
          />
        ))}
      </div>
    </div>
  );
}
