import type { Metadata, Viewport } from "next";

import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { BASE_URL, OPEN_GRAPH_IMAGE } from "@/config";

const title = "GLUA's Supertux Tournament";
const description =
  "Welcome to the Supertux Tournament! Join us for an exciting gaming experience with Supertux, hosted by GLUA. Compete, have fun and win amazing prizes!";
const url = BASE_URL;

export const metadata: Metadata = {
  title: {
    template: `${title} - %s`,
    default: `${title}`,
  },
  description,
  authors: [
    {
      name: "GLUA - Grupo de Linux da Universidade de Aveiro",
      url,
    },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-chrome-512x512",
      url: "/android-chrome-512x512.png",
    },
  },
  metadataBase: new URL(url),
  openGraph: {
    title: {
      template: `${title} - %s`,
      default: `${title}`,
    },
    description,
    url,
    siteName: title,
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
      template: `${title} - %s`,
      default: `${title}`,
    },
    description,
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

export const viewport: Viewport = {
  themeColor: "#ff8e2c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="keywords"
          content="Supertux, torneio, tournament, Supertux competition, GLUA, Grupo de Linux, UA, Linux, Open Source, glua.pt, glua.ua.pt"
        />
        <script
          src="https://afarkas.github.io/lazysizes/lazysizes.min.js"
          async
        ></script>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
