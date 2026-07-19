import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  return {
    title: "PortofoonPrijs — bereken jouw portofoonsysteem",
    description: "Bereken in één minuut welk Motorola portofoonsysteem past, of een repeater nodig is en wat de globale investering wordt.",
    openGraph: {
      title: "Wat kost jouw portofoonsysteem?",
      description: "Direct een Motorola-advies, repeateradvies en globale prijsindicatie.",
      type: "website",
      images: [{ url: image, width: 1536, height: 1024, alt: "PortofoonPrijs calculator" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Wat kost jouw portofoonsysteem?",
      description: "Direct een Motorola-advies, repeateradvies en globale prijsindicatie.",
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body>{children}</body></html>;
}
