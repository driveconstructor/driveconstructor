import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Drive Constructor",
  description: "Online educuation tool for electrical engineering students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container mx-auto">
          <nav className="flex flex-wrap items-center justify-between bg-gray-600 p-6 text-white">
            <div className="mr-6 flex flex-shrink-0 items-center">
              <span className="text-xl font-semibold tracking-tight">
                Drive Constructor
              </span>
            </div>
            <div className="block w-full flex-grow lg:flex lg:w-auto lg:items-center">
              <div className="text-sm lg:flex-grow">
                <Link
                  href="#Docs"
                  className="mr-4 mt-4 block hover:text-blue-300 lg:mt-0 lg:inline-block"
                >
                  Docs
                </Link>
                <Link
                  href="#Exercices"
                  className="mr-4 mt-4 block hover:text-blue-300 lg:mt-0 lg:inline-block"
                >
                  Exercices
                </Link>
              </div>
              <div>
                <Link
                  href="#mysystems"
                  className="mt-4 inline-block rounded border border-white px-4 py-2 text-sm leading-none hover:border-transparent hover:bg-white hover:text-blue-300 lg:mt-0"
                >
                  My systems
                </Link>
              </div>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
