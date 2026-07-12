'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Prices for services', href: '/prices' },
  { label: 'About us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Login', href: '/login' },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname === href;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#202020]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[92px] max-w-[1040px] items-center justify-between px-7 py-3.5">
        <Link href="/" aria-label="BIO CWT home">
          <Image className="h-auto w-[130px]" src="/images/logo.png" alt="BIO CWT" width={197} height={84} priority />
        </Link>
        <nav className="hidden items-center gap-10 text-[15px] font-semibold md:flex" aria-label="Main navigation">
          {links.map(({ label, href }) => {
            const active = isActive(href);
            const content = (
              <>
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2.5px] rounded-full bg-[#f0b488] transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </>
            );
            return href.startsWith('/#') ? (
              <a key={href} href={href} className="group relative pb-1 transition hover:text-[#f0b488]">
                {content}
              </a>
            ) : (
              <Link key={href} href={href} className="group relative pb-1 transition hover:text-[#f0b488]">
                {content}
              </Link>
            );
          })}
        </nav>
        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#202020]/60 p-2 text-white"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {open ? (
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {/* Mobile drawer */}
        {open && (
          <>
            <div className="fixed inset-0 z-40 md:hidden" aria-hidden onClick={() => setOpen(false)} />
            <aside className={`fixed right-0 top-0 z-50 h-full w-3/4 max-w-xs transform bg-[#0f0f0f]/95 p-6 transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-modal="true">
              <div className="flex items-center justify-between">
                <div />
                <button aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-md p-2 text-white">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-6 text-lg font-semibold">
                {links.map(({ label, href }) => (
                  <Link key={href} href={href} onClick={() => setOpen(false)} className="px-2 py-2">
                    {label}
                  </Link>
                ))}
              </nav>
            </aside>
          </>
        )}
      </div>
    </header>
  );
}
