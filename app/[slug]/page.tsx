import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { seoPageList, seoPages, siteUrl } from "../seo-pages";
import PromptCard from "./prompt-card";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return seoPageList.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = seoPages[(await params).slug];
  if (!page) return {};
  const canonical = `/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { type: "website", url: `${siteUrl}${canonical}`, title: page.title, description: page.description, images: [] },
    twitter: { card: "summary", title: page.title, description: page.description, images: [] },
  };
}

export default async function SeoLandingPage({ params }: Props) {
  const page = seoPages[(await params).slug];
  if (!page) notFound();
  const related = seoPageList.filter(({ slug }) => slug !== page.slug);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Unmarkdown",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web browser",
      url: `${siteUrl}/${page.slug}`,
      description: page.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Unmarkdown", item: siteUrl },
        { "@type": "ListItem", position: 2, name: page.h1, item: `${siteUrl}/${page.slug}` },
      ],
    },
  ];

  return <main className="seo-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <nav className="seo-nav shell" aria-label="Main navigation">
      <Link className="brand" href="/" aria-label="unmarkdown.in home"><span className="brand-mark" aria-hidden="true">M<i>↓</i></span><span className="brand-name">unmarkdown<em>.in</em></span></Link>
      <div><Link href="/#features">Features</Link><Link href="/#templates">Standards</Link><Link className="seo-nav-cta" href="/#studio">Open studio</Link></div>
    </nav>

    <header className="seo-hero">
      <div className="seo-hero-media" role="img" aria-label="Premium dark publishing background with blank professional document sheets" style={{ backgroundImage: "url('/studio-premium-background.jpg')" }} />
      <div className="seo-hero-inner shell">
        <span><i aria-hidden="true" /> {page.eyebrow}</span>
        <h1>{page.h1}</h1>
        <p>{page.lede}</p>
        <div className="seo-hero-actions"><Link href="/#studio">Start in the document studio <b>→</b></Link><Link href="/#templates">Browse document standards</Link></div>
        <ol className="seo-hero-flow" aria-label="How Unmarkdown works">
          <li><b>01</b><span>Upload Markdown</span></li>
          <li><b>02</b><span>Pick a standard</span></li>
          <li><b>03</b><span>Export DOCX or PDF</span></li>
        </ol>
        <small>Free · No sign-up · Your document stays in your browser</small>
      </div>
    </header>

    <section className="seo-problem shell">
      <span className="section-kicker">THE PROBLEM</span>
      <h2>{page.problemHeading}</h2>
      <p>{page.problem}</p>
    </section>

    {page.prompt && <PromptCard label={page.prompt.label} heading={page.prompt.heading} intro={page.prompt.intro} prompt={page.prompt.text} />}

    <section className="seo-benefits">
      <div className="shell">
        <span className="section-kicker">WHAT YOU GET</span>
        <div className="seo-benefit-grid">{page.benefits.map((benefit, index) => <article key={benefit.title}><span>0{index + 1}</span><h2>{benefit.title}</h2><p>{benefit.text}</p></article>)}</div>
      </div>
    </section>

    <section className="seo-steps shell">
      <div><span className="section-kicker">HOW IT WORKS</span><h2>From Markdown to a finished document in three steps</h2></div>
      <ol>{page.steps.map((step, index) => <li key={step.title}><span>{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
    </section>

    <section className="seo-faq">
      <div className="shell"><span className="section-kicker">COMMON QUESTIONS</span><h2>Frequently asked questions</h2><div className="seo-faq-list">{page.faq.map(({ question, answer }) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div>
    </section>

    <section className="seo-related shell" aria-labelledby="related-title">
      <span className="section-kicker">MORE WORKFLOWS</span><h2 id="related-title">Explore related Markdown tools and templates</h2>
      <nav aria-label="Related pages">{related.map((item) => <Link href={`/${item.slug}`} key={item.slug}><span>{item.eyebrow}</span><b>{item.h1}</b><i>→</i></Link>)}</nav>
    </section>

    <section className="seo-final-cta"><div className="shell"><div><span>READY TO PUBLISH</span><h2>Keep the Markdown. Ship the document.</h2></div><Link href="/#top">Open Unmarkdown <b>→</b></Link></div></section>

    <footer className="seo-footer shell"><Link className="brand" href="/"><span className="brand-name">unmarkdown<em>.in</em></span></Link><p>Professional documents from Markdown.</p><Link href="mailto:aichroniclesmedia@gmail.com">aichroniclesmedia@gmail.com</Link></footer>
  </main>;
}
