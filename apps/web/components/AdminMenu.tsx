'use client';

import { useEffect, useRef, useState } from 'react';
import { LogoutButton } from '@/components/LogoutButton';

export function AdminMenu() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={menu} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition duration-200 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7897c0]">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8eadd5] to-[#607fa8] text-lg font-bold shadow-md">A</span>
        <span className="hidden text-left sm:block"><span className="block font-bold">Admin</span><span className="block text-xs text-gray-400">Administrator</span></span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition duration-200 group-hover:bg-white/10 group-hover:text-white ${open ? 'rotate-180 bg-white/10' : ''}`}>
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true"><path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-60 origin-top-right rounded-xl border border-white/10 bg-[#191c20] p-2 text-white shadow-[0_20px_55px_rgba(0,0,0,.5)]">
          <div className="border-b border-white/10 px-3 py-2.5"><p className="text-sm font-semibold">Admin account</p><p className="mt-0.5 text-xs text-gray-400">Manage your session</p></div>
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
