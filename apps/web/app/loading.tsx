import Image from 'next/image';

export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-24">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-[#2b0d05]/80 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#86a4cc]" />
          <Image className="h-auto w-14" src="/images/logo.png" alt="BIO CWT" width={197} height={84} priority />
        </div>
        <p className="text-lg font-semibold text-white">Loading...</p>
      </div>
    </main>
  );
}
