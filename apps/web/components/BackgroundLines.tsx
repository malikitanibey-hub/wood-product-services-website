"use client";

import { useEffect, useState } from "react";

type PathDef = {
  d: string;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function BackgroundLines() {
  const [paths, setPaths] = useState<PathDef[]>([]);
  const [size, setSize] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    let mounted = true;

    const generateLines = () => {
      const w = window.innerWidth || 1200;
      const h = window.innerHeight || 800;
      // number of primary contour lines across the height
      const count = Math.max(8, Math.round(h / 140));
      const segs = Math.max(5, Math.round(w / 220));

      const out: PathDef[] = [];

      for (let i = 0; i < count; i++) {
        const baseY = (i / (count - 1)) * h + rand(-20, 20);

        // create smoother multi-segment path (fewer segments for clarity)
        const pts: { x: number; y: number }[] = [];
        for (let s = 0; s <= segs; s++) {
          const x = (s / segs) * w;
          const jitter = Math.sin((s / segs) * Math.PI * 2 + i * 0.7) * rand(4, 18);
          const y = baseY + jitter + rand(-10, 10) * Math.sin((s / segs) * Math.PI);
          pts.push({ x, y });
        }

        // build smooth cubic bezier path across pts
        let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
        for (let p = 1; p < pts.length; p++) {
          const prev = pts[p - 1];
          const cur = pts[p];
          const midX = (prev.x + cur.x) / 2;
          const cp1x = (prev.x + midX) / 2;
          const cp2x = (midX + cur.x) / 2;
          const cp1y = prev.y + rand(-12, 12);
          const cp2y = cur.y + rand(-12, 12);
          d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${cur.x.toFixed(2)} ${cur.y.toFixed(2)}`;
        }

        // push main path
        out.push({ d });

        // add a single subtle sibling offset path for depth
        const off = rand(6, 14) * (Math.random() > 0.5 ? 1 : -1);
        const d2pts = pts.map((pt) => ({ x: pt.x, y: pt.y + off + rand(-3, 3) }));
        let d2 = `M ${d2pts[0].x.toFixed(2)} ${d2pts[0].y.toFixed(2)}`;
        for (let p = 1; p < d2pts.length; p++) {
          const prev = d2pts[p - 1];
          const cur = d2pts[p];
          const midX = (prev.x + cur.x) / 2;
          const cp1x = (prev.x + midX) / 2;
          const cp2x = (midX + cur.x) / 2;
          const cp1y = prev.y + rand(-8, 8);
          const cp2y = cur.y + rand(-8, 8);
          d2 += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${cur.x.toFixed(2)} ${cur.y.toFixed(2)}`;
        }
        out.push({ d: d2 });
      }

      if (mounted) {
        setSize({ w, h });
        setPaths(out);
      }
    };

    generateLines();

    let t: number | undefined;
    const onResize = () => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(generateLines, 180);
    };

    window.addEventListener("resize", onResize);
    return () => {
      mounted = false;
      window.removeEventListener("resize", onResize);
      if (t) window.clearTimeout(t);
    };
  }, []);

  if (paths.length === 0) return null;

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 bg-lines-svg"
      width="100%"
      height="100%"
      viewBox={`0 0 ${size.w} ${size.h}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.25" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#soft)">
        {paths.map((p, i) => {
          // stronger, clearer tones for wood-like contrast
          const isMain = i % 2 === 0;
          const color = isMain ? 'rgba(200,160,110,0.12)' : 'rgba(20,14,10,0.14)';
          const strokeW = isMain ? 1.6 : 1.0;
          return (
            <path
              key={`P-${i}`}
              d={p.d}
              fill="none"
              stroke={color}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </g>
    </svg>
  );
}
