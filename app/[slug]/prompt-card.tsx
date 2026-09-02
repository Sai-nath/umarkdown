"use client";

import Link from "next/link";
import { useState } from "react";

type Props = { label: string; heading: string; intro: string; prompt: string; studioHref: string };

export default function PromptCard({ label, heading, intro, prompt, studioHref }: Props) {
  const [status, setStatus] = useState("");

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus("Prompt copied. Paste it into your AI chat.");
      window.gtag?.("event", "prompt_copied", { landing_page: label });
    } catch {
      setStatus("Select the prompt and copy it manually.");
    }
  };

  return <section className="seo-prompt">
    <div className="shell seo-prompt-grid">
      <div className="seo-prompt-copy">
        <span className="section-kicker">{label}</span>
        <h2>{heading}</h2>
        <p>{intro}</p>
        <div className="seo-prompt-actions">
          <button type="button" onClick={copyPrompt}>{status.startsWith("Prompt copied") ? "Copied" : "Copy complete prompt"}<span aria-hidden="true">{status.startsWith("Prompt copied") ? "✓" : "⧉"}</span></button>
          <Link href={studioHref}>Try it in the studio <span aria-hidden="true">→</span></Link>
        </div>
        <small aria-live="polite">{status || "No sign-up. Use with any AI assistant."}</small>
      </div>
      <div className="seo-prompt-box">
        <div><span>READY FOR ANY AI CHAT</span><small>Markdown output</small></div>
        <pre tabIndex={0}>{prompt}</pre>
      </div>
    </div>
  </section>;
}
