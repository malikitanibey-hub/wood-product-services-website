import type { Metadata } from "next";
import "./tailwind.css";
import { AppShell } from "@/components/AppShell";
import BackgroundLines from "@/components/BackgroundLines";

export const metadata: Metadata = {
  title: "Wood Product Services",
  description: "Wood product services website",
  icons: {
    icon: "/images/logo-tab.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BackgroundLines />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
