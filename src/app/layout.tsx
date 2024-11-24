import { Inter } from "next/font/google";
import Link from "next/link";
import React from "react";
import "./globals.css";

export const revalidate = false;
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Drive Constructor",
  description: "Online education tool for electrical engineering students",
};

function NavItem({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className={`rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 ${className}`}
      href={href}
    >
      {children}
    </Link>
  );
}

const version = `${process.env.npm_package_version}-${
  process.env.GITHUB_SHA?.substring(0, 6) ?? "snapshot"
}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container mx-auto flex h-screen flex-col justify-between">
          <nav className="flex space-x-4">
            <NavItem href="/" className="text-xl">
              Drive Constructor
            </NavItem>
          </nav>
          <main className="mb-auto"> {children}</main>
          <footer className="my-2 flex justify-end">
            <div>drive constructor 2015-2025 (c)</div>
            <div className="my-1 text-xs">
              &nbsp; version: {version}. built at: {process.env.build_at}
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
