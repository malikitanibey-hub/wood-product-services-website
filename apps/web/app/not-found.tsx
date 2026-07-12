import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative -mt-[92px] flex min-h-screen items-center overflow-hidden bg-[#202020] px-6 pb-16 pt-[130px]">
      <div
        className="absolute inset-0 bg-[url('/images/imag.png')] bg-cover bg-left-top opacity-75"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-[#202020]/55 to-[#202020]/95" aria-hidden="true" />

      <section className="relative mx-auto flex w-full max-w-[1040px] flex-col items-center text-center">
        <div className="flex items-center justify-center gap-6 text-[120px] font-medium leading-none text-white sm:text-[180px] lg:text-[260px]">
          <span>4</span>
          <span className="relative flex aspect-square w-[110px] items-center justify-center overflow-hidden rounded-full border-[12px] border-white bg-[#202020] sm:w-[165px] sm:border-[18px] lg:w-[220px] lg:border-[24px]">
            <Image
              className="h-full w-full object-cover opacity-90"
              src="/images/Vector 30.png"
              alt=""
              width={220}
              height={220}
              priority
            />
          </span>
          <span>4</span>
        </div>

        <h1 className="-mt-2 text-[44px] font-normal leading-tight text-white sm:text-[58px]">Woops</h1>
        <p className="mt-5 max-w-[540px] text-[18px] leading-relaxed text-[#f4d3bc] sm:text-[22px]">
          Oh, you must be lost, there is no such page.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex h-12 min-w-[315px] items-center justify-center rounded-full bg-[#86a4cc] px-10 text-[20px] font-bold text-white transition hover:bg-[#9ab5da] focus:outline-none focus:ring-2 focus:ring-[#f4d3bc]"
        >
          Go to the home page
        </Link>
      </section>
    </main>
  );
}
