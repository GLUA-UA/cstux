import type { Metadata, Viewport } from "next";

import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { BASE_URL, OPEN_GRAPH_IMAGE } from "@/config";

// Application metadata constants
const APP_METADATA = {
  TITLE: "GLUA's Supertux Tournament",
  DESCRIPTION: "Welcome to the Supertux Tournament! Join us for an exciting gaming experience with Supertux, hosted by GLUA. Compete, have fun and win amazing prizes!",
  URL: BASE_URL,
  AUTHOR: {
    name: "GLUA - Grupo de Linux da Universidade de Aveiro",
    url: BASE_URL,
  },
  KEYWORDS: "Supertux, torneio, tournament, Supertux competition, GLUA, Grupo de Linux, UA, Linux, Open Source, glua.pt, glua.ua.pt",
} as const;

// Viewport configuration
export const viewport: Viewport = {
  themeColor: "#ff8e2c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// Application metadata configuration
export const metadata: Metadata = {
  title: {
    template: `${APP_METADATA.TITLE} - %s`,
    default: APP_METADATA.TITLE,
  },
  description: APP_METADATA.DESCRIPTION,
  authors: [APP_METADATA.AUTHOR],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-chrome-512x512",
      url: "/android-chrome-512x512.png",
    },
  },
  metadataBase: new URL(APP_METADATA.URL),
  openGraph: {
    title: {
      template: `${APP_METADATA.TITLE} - %s`,
      default: APP_METADATA.TITLE,
    },
    description: APP_METADATA.DESCRIPTION,
    url: APP_METADATA.URL,
    siteName: APP_METADATA.TITLE,
    images: [
      {
        url: OPEN_GRAPH_IMAGE,
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: `${APP_METADATA.TITLE} - %s`,
      default: APP_METADATA.TITLE,
    },
    description: APP_METADATA.DESCRIPTION,
    creator: "@glua01",
    images: [OPEN_GRAPH_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
};

/**
 * Root layout component
 * Provides the base structure and theme configuration for the application
 * @param children - The child components to be rendered
 * @returns The root layout component
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="keywords" content={APP_METADATA.KEYWORDS} />
        <script
          src="https://afarkas.github.io/lazysizes/lazysizes.min.js"
          async
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
