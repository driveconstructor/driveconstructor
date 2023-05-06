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
          <nav className="flex items-center justify-between flex-wrap bg-gray-600 text-white p-6">
            <div className="flex items-center flex-shrink-0 mr-6">
              <span className="font-semibold text-xl tracking-tight">
                Drive Constructor
              </span>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
              <div className="text-sm lg:flex-grow">
                <Link
                  href="#Docs"
                  className="block mt-4 lg:inline-block lg:mt-0 mr-4 hover:text-blue-300"
                >
                  Docs
                </Link>
                <Link
                  href="#Exercices"
                  className="block mt-4 lg:inline-block lg:mt-0 mr-4 hover:text-blue-300"
                >
                  Exercices
                </Link>
              </div>
              <div>
                <Link
                  href="#mysystems"
                  className="inline-block text-sm px-4 py-2 leading-none border rounded border-white hover:border-transparent hover:text-blue-300 hover:bg-white mt-4 lg:mt-0"
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
