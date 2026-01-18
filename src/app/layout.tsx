import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Rajdhani } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });
const rajdhani = Rajdhani({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-rajdhani'
});

export const metadata: Metadata = {
  title: "LuminaLink",
  description: "Ultrasound Data Uplink",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${mono.variable} ${rajdhani.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
