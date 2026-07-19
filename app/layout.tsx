import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og-calm.png`;
  return {
    title: "Communicatie configurator | Firecom",
    description: "Stel een professionele Motorola-portofoonoplossing samen en ontvang een indicatieve prijs en een passende offerte van Firecom.",
    icons: {
      icon: [
        { url: "/firecom-favicon-brand-32.png", type: "image/png", sizes: "32x32" },
        { url: "/firecom-favicon-brand-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [{ url: "/firecom-apple-touch-icon-brand-180.png", type: "image/png", sizes: "180x180" }],
    },
    openGraph: {
      title: "Communicatie configurator | Firecom",
      description: "Configureer toestellen, bereik, vergunning en onderhoud met een live indicatieve prijs.",
      type: "website",
      images: [{ url: image, width: 1536, height: 1024, alt: "Communicatie configurator van Firecom" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Communicatie configurator | Firecom",
      description: "Configureer toestellen, bereik, vergunning en onderhoud met een live indicatieve prijs.",
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body>{children}</body></html>;
}
