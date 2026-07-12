import Image from 'next/image';

export function Advantages() {
  return (
    <section className="mx-auto max-w-[1000px] px-6 py-24 md:px-12" id="advantages">
      <h2 className="mb-16 text-[42px] font-medium uppercase leading-tight md:text-[58px]">Advantages<br />working with us</h2>
      <div className="grid items-center gap-10 md:grid-cols-[1.15fr_.85fr] md:gap-20">
        <Image className="h-auto w-full rounded-[28px]" src="/images/video.png" alt="Wood staircase produced in our carpentry workshop" width={609} height={386} />
        <ul className="grid list-none gap-7 p-0 text-base leading-relaxed md:text-lg">
          <li>In-house carpentry production</li>
          <li>We only treat wood with environmentally friendly and safe products</li>
          <li>Prices from the manufacturer, no extra charges</li>
        </ul>
      </div>
      <a className="mx-auto mt-14 flex w-[330px] max-w-full justify-center rounded-full bg-[#7897c0] px-5 py-2.5 font-bold" href="#contact">Receive a consultation</a>
    </section>
  );
}
