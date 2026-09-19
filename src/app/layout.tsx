import type { Metadata } from "next";
import { Outfit, Kalam } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import CursorGlow from "@/components/layout/CursorGlow";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const kalam = Kalam({
  weight: ['400', '700'],
  variable: "--font-kalam",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://storeroast.live"),
  title: "StoreRoast - Find Out Why You're Losing Downloads",
  description: "Brutally honest, AI-powered app & website teardowns to fix your messaging and skyrocket conversions.",
  openGraph: {
    title: "StoreRoast - Find Out Why You're Losing Downloads",
    description: "Brutally honest, AI-powered app & website teardowns to fix your messaging and skyrocket conversions.",
    url: "https://storeroast.live",
    siteName: "StoreRoast",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StoreRoast - Find Out Why You're Losing Downloads",
    description: "Brutally honest, AI-powered app & website teardowns to fix your messaging and skyrocket conversions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${kalam.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans relative overflow-x-hidden">
        <CursorGlow />
        {/* Sleek monochrome background styling - removing old gradients */}
        <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none -z-20 mix-blend-overlay" />
        <Toaster  
          position="top-center" 
          toastOptions={{
            style: {
              background: 'white',
              color: '#333',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
              borderRadius: '20px',
              padding: '16px 24px',
              fontSize: '15px',
              fontWeight: 600,
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
          }} 
        />
        {children}
      </body>
    </html>
  );
}
