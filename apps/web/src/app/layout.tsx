import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Records and remembrance: Timeline",
  description:
    "ミュージシャン門田匡陽の活動年表。日本語縦書きデザインで25年間の音楽活動を時系列で表示。",
  keywords:
    "門田匡陽, Monden MASAAKI, BURGER NUDS, Good Dog Happy Men, Poet-type.M, 年表, タイムライン",
  authors: [{ name: "Monden MASAAKI Timeline Project" }],
  openGraph: {
    title: "Records and remembrance: Timeline",
    description: "ミュージシャン門田匡陽の活動年表",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
