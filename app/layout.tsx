import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Preloader } from "@/components/preloader";
import { Providers } from "@/components/providers";

import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "UDGAM | University Sports Festival",
    template: "%s | UDGAM",
  },
  description:
    "UDGAM is a live university sports festival platform for fixtures, finals, live scores, and gallery updates.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Preloader />
          <Navigation />
          <main className="siteMain">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
