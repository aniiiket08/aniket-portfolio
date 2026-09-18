import type { Metadata } from "next";
import { Libre_Baskerville, Archivo, Josefin_Sans } from "next/font/google";
import BackgroundCanvas from "@/components/background-canvas";
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

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aniket Patil - Portfolio",
  description:
    "Computer Science (AI) undergrad at KLE Technological University building ML-driven systems, embedded projects, and signal processing applications.",
  openGraph: {
    title: "Aniket Patil - Portfolio",
    description:
      "Computer Science (AI) undergrad at KLE Technological University building ML-driven systems, embedded projects, and signal processing applications.",
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
      "Computer Science (AI) undergrad at KLE Technological University building ML-driven systems, embedded projects, and signal processing applications.",
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
      <body
        className={`${libreBaskerville.variable} ${archivo.variable} ${josefinSans.variable} font-body text-foreground antialiased min-h-screen flex flex-col relative selection:bg-accent selection:text-foreground`}
      >
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
