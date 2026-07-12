"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }
  return (
    <button
      onClick={logout}
      className="group mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-200 transition duration-200 hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] transition group-hover:bg-red-500/15">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[18px] w-[18px]"
          aria-hidden="true"
        >
          <path
            d="M10 17l5-5-5-5M15 12H3m10-8h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex-1">Log out</span>
      <span className="text-xs text-gray-500 transition group-hover:text-red-300">
        
      </span>
    </button>
  );
}
