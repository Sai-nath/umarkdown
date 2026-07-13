import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3001";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og-v3.png`;
  const title = "unmarkdown.in — Professional documents from Markdown";
  const description = "Turn one Markdown file into a polished SRS, architecture document, report, research paper, PDF, or professional Word document — privately in your browser.";
  return {
    metadataBase: new URL("https://www.unmarkdown.in"),
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    alternates: { canonical: "/" },
    openGraph: { title, description, images: [{ url: image, width: 1717, height: 916, alt: "unmarkdown.in — From Markdown to polished pages" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "G-LDB257GYZP";

  return <html lang="en"><body>
    {gaId && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `}</Script>
    </>}
    {children}
  </body></html>;
}
