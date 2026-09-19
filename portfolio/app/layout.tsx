import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Hud from "./components/Hud";
import Footer from "./components/Footer";
import { profile } from "@/lib/data";

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: "Aditya Singh — Systems Engineering & Agent Architectures",
    template: "%s — Aditya Singh",
  },
  description:
    "Systems engineering portfolio of Aditya Singh — agent architectures, guardrails, evaluation harnesses, and distributed streaming pipelines. B.Tech CCE @ MIT Manipal.",
  keywords: [
    "Aditya Singh",
    "Systems Engineer",
    "AI Systems",
    "Agent Architectures",
    "Guardrails",
    "RAG Pipelines",
    "Evaluation Harnesses",
    "Portfolio",
  ],
  openGraph: {
    title: "Aditya Singh — Systems Engineering & Agent Architectures",
    description:
      "Systems engineering portfolio of Aditya Singh — agent architectures, guardrails, evaluation harnesses, and distributed streaming pipelines. B.Tech CCE @ MIT Manipal.",
    url: profile.site,
    siteName: "Aditya Singh",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Singh — Systems Engineering & Agent Architectures",
    description:
      "Systems engineering portfolio of Aditya Singh — agent architectures, guardrails, evaluation harnesses, and distributed streaming pipelines. B.Tech CCE @ MIT Manipal.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0f" },
  ],
};

// Runs before first paint: restores saved theme, marks JS as available
// (scroll reveals are gated on this so no-JS visitors see all content).
const themeInit = `(function(){try{if(localStorage.getItem("as-theme")==="b"){document.documentElement.setAttribute("data-theme","b")}}catch(e){}document.documentElement.classList.add("js")})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
          integrity="sha384-3WuAYeWwFlTK6nHfipy136z9/xQECkxofRrklER1CudS1CEFlYg3FuQIGkxB3hKn"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body
        className={`${jbMono.variable} min-h-screen bg-bg font-sans text-ink antialiased`}
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Hud />
        <main id="main" className="flex-1 pt-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
