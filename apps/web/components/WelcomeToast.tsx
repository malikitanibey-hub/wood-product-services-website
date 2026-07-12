'use client';

import { useEffect, useState } from 'react';

export function WelcomeToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('welcome') !== '1') return;

    setVisible(true);
    window.history.replaceState({}, '', '/admin');
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div role="status" className="fixed left-1/2 top-6 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-emerald-300/30 bg-emerald-700 px-6 py-3 text-center text-sm font-semibold text-white shadow-2xl">
      Welcome back, Admin. You have successfully signed in.
    </div>
  );
}
