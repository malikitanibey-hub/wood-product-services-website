"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/home/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState({
    title: "Admin login",
    subtitle: "Sign in to access the administration dashboard",
    emailLabel: "Email",
    passwordLabel: "Password",
    buttonText: "Sign In",
    footerText: "© BIO CWT. All rights reserved.",
    backgroundImage: "/images/imag.png",
    decorativeImage: "/images/image.png",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reason") === "authentication-required") {
      setNotice("Please log in first to access the admin dashboard.");
      window.history.replaceState({}, "", "/login");
    }
  }, []);
  useEffect(() => {
    fetch(`${API_URL}/site-content`)
      .then((r) => (r.ok ? r.json() : null))
      .then((x) => {
        if (x?.login) setContent(x.login);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(""), 5000);
    return () => window.clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        setError(
          response.status === 401
            ? "Invalid email or password"
            : "Unable to sign in. Please try again.",
        );
        return;
      }
      router.replace("/admin?welcome=1");
      router.refresh();
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#151719]">
      {error && (
        <div
          role="alert"
          className="fixed left-1/2 top-28 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-red-400/30 bg-red-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-2xl"
        >
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="fixed left-1/2 top-28 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-[#7897c0]/40 bg-[#26384f] px-6 py-3 text-center text-sm font-semibold text-white shadow-2xl"
        >
          {notice}
        </div>
      )}
      <Header />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div
          className="absolute inset-0 bg-cover bg-left-top opacity-25"
          style={{backgroundImage:`url('${content.backgroundImage}')`}}
          aria-hidden="true"
        />
        <Image
          className="pointer-events-none absolute -bottom-20 -left-24 hidden w-[360px] opacity-75 sm:block lg:w-[430px]"
          src={content.decorativeImage}
          alt=""
          width={430}
          height={432}
          priority
        />
        <section className="relative z-10 w-full max-w-[480px] rounded-[14px] border border-white/10 bg-[#191c1e]/95 px-5 py-7 shadow-2xl backdrop-blur sm:px-8 sm:py-9">
          <h1 className="text-2xl font-semibold leading-tight text-white sm:text-[28px]">
            {content.title}
          </h1>
          <p className="mt-1 text-sm text-gray-300">{content.subtitle}</p>
          <form className="mt-6 grid gap-5" onSubmit={submit} noValidate>
            <label className="grid gap-2 text-sm text-gray-300">
              {content.emailLabel}
              <input
                className="min-w-0 rounded-[8px] border border-white/10 bg-transparent px-4 py-3 text-white outline-none transition focus:border-[#7897c0]"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              {content.passwordLabel}
              <input
                className="min-w-0 rounded-[8px] border border-white/10 bg-transparent px-4 py-3 text-white outline-none transition focus:border-[#7897c0]"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button
              disabled={loading || !email || password.length < 8}
              className="mt-1 rounded-[8px] bg-[#7897c0] px-5 py-3 font-bold text-white transition hover:bg-[#8ba8ce] disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
            >
              {loading ? "Signing in…" : content.buttonText}
            </button>
          </form>
          <p className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-gray-500">
            {content.footerText}
          </p>
        </section>
      </main>
    </div>
  );
}
