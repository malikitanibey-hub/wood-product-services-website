"use client";
import { useEffect, useState } from "react";
export function ContactDetails() {
  const [c, setC] = useState({
    contactTitle: "CONTACT US",
    phoneLabel: "PHONE",
    phone: "+420 000 000 000",
    addressLabel: "ADDRESS",
    address: "Na Plzeňce 1166/0\n150 00, Prague",
    hoursLabel: "WORKING HOURS",
    hours: "Mon – Fri: 8:00 – 18:00",
    mapUrl:
      "https://maps.google.com/maps?q=Na+Plze%C5%88ce+1166%2F0+150+00+Prague&output=embed",
  });
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/site-content`,
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((x) => {
        if (x?.contact) setC(x.contact);
      })
      .catch(() => {});
  }, []);
  return (
    <section className="mx-auto grid max-w-[1060px] gap-12 overflow-hidden px-6 pt-28 md:grid-cols-2 md:gap-16 md:px-12">
      <div>
        <h2 className="mb-8 text-[40px] font-medium uppercase md:text-[52px]">
          {c.contactTitle}
        </h2>
        <div className="space-y-6 text-base md:text-lg">
          <div>
            <p className="mb-1 text-sm uppercase text-gray-400">
              {c.phoneLabel}
            </p>
            <a
              href={`tel:${c.phone.replace(/\s/g, "")}`}
              className="text-[#f0b488]"
            >
              {c.phone}
            </a>
          </div>
          <div>
            <p className="mb-1 text-sm uppercase text-gray-400">
              {c.addressLabel}
            </p>
            <address className="whitespace-pre-line not-italic">
              {c.address}
            </address>
          </div>
          <div>
            <p className="mb-1 text-sm uppercase text-gray-400">
              {c.hoursLabel}
            </p>
            <p>{c.hours}</p>
          </div>
        </div>
      </div>
      <div className="h-[320px] overflow-hidden rounded-[28px] shadow-lg">
        <iframe
          src={c.mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Location map"
        />
      </div>
    </section>
  );
}
