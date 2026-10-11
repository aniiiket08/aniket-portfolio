import type { Metadata } from "next";
import { Libre_Baskerville, Archivo, Space_Grotesk, Martel_Sans } from "next/font/google";
import BackgroundCanvas from "@/components/background-canvas";
import LoadingIntro from "@/components/loading-intro";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const martelSans = Martel_Sans({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-martel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aniket Patil - Portfolio",
  description:
    "Computer Science (AI) undergrad at KLE Technological University building ML-driven systems, embedded projects and signal processing applications.",
  openGraph: {
    title: "Aniket Patil - Portfolio",
    description:
      "Computer Science (AI) undergrad at KLE Technological University building ML-driven systems, embedded projects and signal processing applications.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aniket Patil - Portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aniket Patil - Portfolio",
    description:
      "Computer Science (AI) undergrad at KLE Technological University building ML-driven systems, embedded projects and signal processing applications.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon.png",
  },
  metadataBase: new URL("https://aniketpatil.dev"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth bg-[#070410]">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #loading-intro-ssr {
                position: fixed;
                inset: 0;
                z-index: 9999;
                background-color: #070707;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              #loading-intro-ssr.hide {
                display: none;
              }
            `,
          }}
        />
      </head>
      <body
        className={`${libreBaskerville.variable} ${archivo.variable} ${spaceGrotesk.variable} ${martelSans.variable} font-body text-foreground antialiased min-h-screen flex flex-col relative selection:bg-accent selection:text-foreground`}
      >
        {/* SSR Loading Overlay - Shows immediately on first paint */}
        <div id="loading-intro-ssr" />

        {/* Loading Intro */}
        <LoadingIntro />

        {/* Persistent Site-wide Ferrofluid WebGL Background Layer */}
        <BackgroundCanvas />

        {/* Page Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
