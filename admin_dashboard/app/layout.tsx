import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GLUA's SuperTux Tournament",
  description: "A supertux tournament manager created by GLUA",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
