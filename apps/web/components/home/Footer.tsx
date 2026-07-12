import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-24 bg-[#171515] px-8 py-12">
      <div className="mx-auto grid max-w-[1040px] gap-10 md:grid-cols-3">
        <div>
          <Image className="h-auto w-[130px]" src="/images/logo.png" alt="BIO CWT" width={197} height={84} />
          <p className="mt-4 text-sm leading-relaxed text-gray-400">Manufacturing solid wood products according to individual drawings since 1995.</p>
        </div>
        <div>
          <h3 className="mb-5 text-base font-semibold uppercase tracking-wide text-gray-300">Contact</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>
              <a href="tel:+420000000000" className="transition hover:text-[#f0b488]">+420 000 000 000</a>
            </li>
            <li>
              <address className="not-italic">Na Plzeňce 1166/0<br />150 00, Prague</address>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-5 text-base font-semibold uppercase tracking-wide text-gray-300">Links</h3>
          <ul className="space-y-3 text-sm">
            {[
              ['Home', '/'],
              ['Gallery', '/gallery'],
              ['About us', '/about'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-gray-400 transition hover:text-[#f0b488]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1040px] border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        2026 BIO CWT. All rights reserved.
      </div>
    </footer>
  );
}
