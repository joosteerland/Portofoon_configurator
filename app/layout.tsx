import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og-calm.png`;
  return {
    title: "PortofoonPrijs — professionele Motorola-configurator",
    description: "Configureer een passende Motorola R2, R5, R7 of R7Ex en ontvang een onderbouwd modeladvies met actuele openbare vanafprijs.",
    openGraph: {
      title: "Configureer de juiste portofoonoplossing",
      description: "Van Motorola R2 tot explosieveilige R7Ex — technisch modeladvies met actuele vanafprijs.",
      type: "website",
      images: [{ url: image, width: 1536, height: 1024, alt: "PortofoonPrijs calculator" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Configureer de juiste portofoonoplossing",
      description: "Van Motorola R2 tot explosieveilige R7Ex — technisch modeladvies met actuele vanafprijs.",
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body>{children}</body></html>;
}
