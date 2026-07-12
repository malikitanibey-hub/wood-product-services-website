"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [content, setContent] = useState({
    title: "ANY QUESTIONS?",
    description:
      "Write to us and we will be sure to answer all your questions and give you a comprehensive consultation.",
    namePlaceholder: "Your name",
    phonePlaceholder: "Your telephone number",
    questionPlaceholder: "Your question",
    buttonText: "Send",
    successTitle: "Thank you!",
    successMessage:
      "We have received your message and will get back to you as soon as possible.",
    formImage: "/images/image.png",
  });
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/site-content`,
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((x) => {
        if (x?.contact) setContent(x.contact);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <section
        className="mx-auto flex max-w-[1000px] justify-center px-6 pt-24"
        id="contact"
      >
        <div className="w-full max-w-[360px] rounded-[14px] border border-white/10 bg-[#171a1c]/95 px-8 py-10 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#3fa34d] text-[42px] leading-none text-[#3fa34d]">
            ✓
          </div>
          <h2 className="mt-8 text-[28px] font-bold text-white">
            {content.successTitle}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-200">
            {content.successMessage}
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex min-w-[210px] justify-center rounded-[10px] bg-[#7897c0] px-6 py-3 font-bold text-white transition hover:bg-[#8ba8ce]"
          >
            Back to homepage
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      className="mx-auto grid max-w-[1000px] gap-12 overflow-hidden px-6 pt-24 md:grid-cols-2 md:gap-20 md:px-12"
      id="contact"
    >
      <div>
        <h2 className="mb-12 text-center text-[40px] font-medium uppercase md:text-[52px]">
          {content.title}
        </h2>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label>
            <span className="sr-only">{content.namePlaceholder}</span>
            <input
              className="w-full rounded-[22px] border-2 border-[#7897c0] bg-transparent px-5 py-3"
              name="name"
              placeholder={content.namePlaceholder}
            />
          </label>
          <label>
            <span className="sr-only">{content.phonePlaceholder}</span>
            <input
              className="w-full rounded-[22px] border-2 border-[#7897c0] bg-transparent px-5 py-3"
              type="tel"
              name="phone"
              placeholder={content.phonePlaceholder}
            />
          </label>
          <label>
            <span className="sr-only">{content.questionPlaceholder}</span>
            <textarea
              className="w-full resize-y rounded-[22px] border-2 border-[#7897c0] bg-transparent px-5 py-3"
              name="question"
              placeholder={content.questionPlaceholder}
              rows={5}
            />
          </label>
          <button
            className="min-w-24 rounded-full bg-[#7897c0] px-5 py-2 font-bold"
            type="submit"
          >
            {content.buttonText}
          </button>
        </form>
      </div>
      <div className="pt-10 text-lg leading-relaxed md:pt-20">
        <p>{content.description}</p>
        <Image
          className="mx-auto mb-[-100px] mt-5 h-auto w-[340px] max-w-full"
          src={content.formImage}
          alt="Wood slice"
          width={430}
          height={432}
        />
      </div>
    </section>
  );
}
