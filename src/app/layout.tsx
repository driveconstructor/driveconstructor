import { Metadata } from "next";
import { Inter } from "next/font/google";
import favicon from "../images/logo.svg";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

// as suggested by next.js for static export output (script nonce is not possible)
// and also disable external connection
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
    connect-src 'self';
`;

export const metadata: Metadata = {
  icons: [{ rel: "icon", url: favicon.src, type: "image/svg+xml" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={cspHeader} />
      </head>
      <body>{children}</body>
    </html>
  );
}
