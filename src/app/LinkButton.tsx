import Link from "next/link";

export default function LinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      href={href}
    >
      {children}
    </Link>
  );
}
