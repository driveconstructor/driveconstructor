import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../images/logo.svg";

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

const feedbackFormUrl = process.env.FEEDBACK_FORM_URL;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto flex h-screen flex-col justify-between">
      <nav className="flex items-center">
        <NavItem href="/" className="text-xl">
          <div className="flex">
            <Image src={logo.src} alt="logo" width={20} height={20} />
            <div className="pl-1 hidden md:block">Drive Constructor</div>
          </div>
        </NavItem>
        <NavItem href="/docs/textbook" className="text-m">
          Textbook
        </NavItem>
        <NavItem href="/docs/exercises" className="text-m">
          Exercises
        </NavItem>
        <NavItem href="/my-systems" className="text-m">
          My systems
        </NavItem>
        {feedbackFormUrl ? (
          <NavItem href={feedbackFormUrl} className="text-m">
            Send feedback
          </NavItem>
        ) : null}
      </nav>
      <main className="mb-auto"> {children}</main>
      <footer className="my-2 flex justify-end">
        <div>drive constructor 2015-2025 (c)</div>
        <div className="my-1 text-xs">
          &nbsp; version: {version}. built at: {process.env.build_at}
        </div>
      </footer>
    </div>
  );
}
