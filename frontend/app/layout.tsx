import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus ERP — Internship Management",
  description: "Manage interns, tasks, file submissions, and team operations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
