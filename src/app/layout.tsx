// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';

const siteConfig = {
  name: 'Fanan Team Hub',
  description: 'Discover, manage, and purchase VSTi plugins, MIDI machines, and audio tools from Fanan Team. Explore our packs and find the perfect sound for your music production.',
  url: 'https://fananteampro.com', // Replace with your final domain
  ogImage: 'https://fananteampro.com/images/A3.png', // A default OG image
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Fanan Team", "VST", "VSTi", "MIDI plugins", "audio plugins", "music production", "synthesizer", "arranger keyboard", "DAW", "Fanan team plugins", "free VST"],
  authors: [{ name: "Fanan Team", url: siteConfig.url }],
  creator: "Fanan Team",
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 166,
        height: 72,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@fananteam', // Replace with your actual Twitter handle if you have one
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Impact&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main className="flex-grow py-8">
              {children}
            </main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
