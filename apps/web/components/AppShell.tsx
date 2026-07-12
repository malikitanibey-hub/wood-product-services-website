'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';

const standaloneRoutes = ['/login', '/admin'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const standalone = standaloneRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  return (
    <div className="relative z-10">
      {!standalone && <Header />}
      {children}
      {!standalone && <Footer />}
    </div>
  );
}
