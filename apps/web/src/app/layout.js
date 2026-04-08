import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Eidos | Understand the Design Behind Any Website",
  description:
    "Instantly explore fonts, colors, and UI components of any modern website. Deconstruct design systems in seconds.",
  metadataBase: new URL("https://eidos-app.vercel.app"), // Replace with your actual URL once deployed

  // 🌍 Open Graph / Facebook / LinkedIn
  openGraph: {
    title: "Eidos | Design Discovery Engine",
    description:
      "Instantly explore fonts, colors, and UI components of any modern website.",
    url: "https://eidos-app.vercel.app",
    siteName: "Eidos",
    images: [
      {
        url: "/og-image.png", // Ensure this file is in your /public folder
        width: 1200,
        height: 630,
        alt: "Eidos Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 🐦 Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "Eidos | Design System Extractor",
    description: "Analyze and replicate design systems instantly.",
    images: ["/og-image.png"],
  },

  // 📱 Icons
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-[#050505] antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
