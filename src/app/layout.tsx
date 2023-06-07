import { Inter } from "next/font/google";
import Link from "next/link";
import React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Drive Constructor",
  description: "Online educuation tool for electrical engineering students",
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
              Drive Consructor
            </NavItem>
            <NavItem href="/mysystems">My systems</NavItem>
            <NavItem href="/about">About</NavItem>
          </nav>
          <main className="mb-auto"> {children}</main>
          <footer className="my-2 flex justify-end">
            drive constructor 2018-2023 (c)
          </footer>
        </div>
      </body>
    </html>
  );
}
