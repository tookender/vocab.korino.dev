import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
  metadataBase: new URL("https://vocab.korino.dev"),
  title: {
    default: "Vocabulary Trainer",
    template: "%s | Vocabulary Trainer",
  },
  description: "A vocabulary trainer that reads JSON and helps you practice effectively",
  applicationName: "Vocabulary Trainer",
  keywords: [
    "vocabulary",
    "language learning",
    "flashcards",
    "study",
    "French",
    "German",
    "FR-DE",
    "JSON",
  ],
  category: "education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vocabulary Trainer",
    description:
      "Practice vocabulary with a sleek tape-style reveal and JSON import - Track known/unknown words easily",
    url: "https://vocab.korino.dev",
    siteName: "Vocabulary Trainer",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vocabulary Trainer",
    description:
      "Practice vocabulary with a sleek tape-style reveal and JSON import - Track known/unknown words easily",
  },
  icons: {
    icon: [
      { url: "/favicon-light.ico", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.ico", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/favicon-light.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Vocabulary Trainer",
            url: "https://vocab.korino.dev",
            description:
              "A minimal, fast vocabulary trainer that reads JSON and helps you practice effectively.",
          })}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
