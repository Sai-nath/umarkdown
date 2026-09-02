import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const title = "Markdown to Word and PDF Converter | Unmarkdown";
const description = "Convert Markdown into a polished Word document or PDF with live preview, professional templates, branding and diagrams. Free and private in your browser.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.unmarkdown.in"),
  title,
  description,
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", title, description, images: [{ url: "/og-v3.png", width: 1717, height: 916, alt: "Unmarkdown turns Markdown into professional Word and PDF documents" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og-v3.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : undefined,
};

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
