"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { marked, Renderer, Tokens } from "marked";
import DOMPurify from "dompurify";

const starter = `# Software Requirements Specification

**Project:** unmarkdown.in Document Studio
**Version:** 1.0  
**Status:** Draft

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for a professional Markdown publishing workspace.

### 1.2 Scope

The system allows users to upload Markdown, edit it live, apply a document standard, and export a polished PDF or editable Word document.

## 2. System Overview

> The source Markdown remains private and is processed inside the browser.

## 3. Functional Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-001 | The system shall accept a valid .md file. | Must |
| FR-002 | The system shall display a live document preview. | Must |
| FR-003 | The system shall export PDF and DOCX. | Must |

## 4. Non-Functional Requirements

- **NFR-001 — Privacy:** Source files shall not leave the browser.
- **NFR-002 — Usability:** Export shall require no specialist knowledge.
- **NFR-003 — Compatibility:** DOCX output shall open in Microsoft Word.

## 5. Acceptance Criteria

1. Uploading a Markdown file displays its content.
2. Changing a template updates the preview immediately.
3. The exported document preserves the selected professional style.`;

const themes = {
  legal: { label: "Legal & Policy", category: "Policies, terms & agreements", accent: "#24466f", ink: "#202733", paper: "#fffefa", font: "Georgia, 'Times New Roman', serif", wordFont: "Cambria", sample: "PRIVACY\nPOLICY", description: "Formal, trustworthy and clause-ready" },
  srs: { label: "SRS Standard", category: "Requirements & specifications", accent: "#145a7a", ink: "#17252d", paper: "#ffffff", font: "Arial, Helvetica, sans-serif", wordFont: "Aptos", sample: "SOFTWARE\nREQUIREMENTS", description: "Structured, numbered and audit-ready" },
  architecture: { label: "Architecture", category: "System design documents", accent: "#5b4b9a", ink: "#222236", paper: "#fcfcff", font: "Arial, Helvetica, sans-serif", wordFont: "Aptos", sample: "SYSTEM\nARCHITECTURE", description: "Technical, precise and diagram-friendly" },
  executive: { label: "Executive", category: "Reports & proposals", accent: "#1e5f54", ink: "#17211f", paper: "#ffffff", font: "Arial, Helvetica, sans-serif", wordFont: "Aptos", sample: "QUARTERLY\nPERSPECTIVE", description: "Clear, authoritative and board-ready" },
  editorial: { label: "Editorial", category: "Articles & long-form", accent: "#9f3058", ink: "#292421", paper: "#fffdf9", font: "Georgia, 'Times New Roman', serif", wordFont: "Georgia", sample: "THE ART OF\nATTENTION", description: "Refined, literary and expressive" },
  academic: { label: "Academic", category: "Research & white papers", accent: "#7a3525", ink: "#27211f", paper: "#fffefa", font: "Georgia, 'Times New Roman', serif", wordFont: "Cambria", sample: "RESEARCH\nPAPER", description: "Formal, readable and citation-ready" },
  minimal: { label: "Technical Minimal", category: "Developer documentation", accent: "#3d4d76", ink: "#1f2430", paper: "#fbfcff", font: "ui-monospace, SFMono-Regular, Menlo, monospace", wordFont: "Aptos Mono", sample: "LESS,\nBUT BETTER.", description: "Crisp, modern and code-focused" },
} as const;

const cssPresets = {
  policy: { label: "Policy", description: "Legal clauses & definitions", css: `.document-preview { font-family: Georgia, serif; color: #202733; }\n.document-preview h1 { text-align: center; border: 0; font-size: 38px; }\n.document-preview h2 { color: #24466f; border-bottom: 1px solid #b9c5d3; }\n.document-preview p { text-align: justify; hyphens: auto; }\n.document-preview strong { color: #172f4d; }` },
  corporate: { label: "Corporate", description: "Clean business reporting", css: `.document-preview { font-family: Arial, sans-serif; }\n.document-preview h1 { color: #16324f; border-bottom: 4px solid #2d6a8e; padding-bottom: 16px; }\n.document-preview h2 { color: #2d6a8e; }\n.document-preview table { box-shadow: 0 0 0 1px #d5dce3; }` },
  modern: { label: "Modern", description: "Bold contemporary hierarchy", css: `.document-preview { font-family: Arial, sans-serif; }\n.document-preview h1 { font-size: 44px; letter-spacing: -0.05em; }\n.document-preview h2 { border-left: 5px solid var(--accent); padding-left: 14px; }\n.document-preview blockquote { border-radius: 4px; background: #f3f5f7; }` },
  classic: { label: "Classic", description: "Traditional book typography", css: `.document-preview { font-family: Georgia, serif; }\n.document-preview h1 { text-align: center; font-weight: 400; }\n.document-preview h2 { color: #292421; font-variant: small-caps; letter-spacing: .04em; }\n.document-preview p { text-align: justify; text-indent: 1.4em; }` },
  compact: { label: "Compact", description: "Dense policy or handbook", css: `.document-preview p, .document-preview li { font-size: 10.5px; line-height: 1.45; }\n.document-preview h2 { margin-top: 22px; margin-bottom: 7px; }\n.document-preview h3 { margin-top: 16px; margin-bottom: 5px; }\n.document-preview table { margin: 12px 0; }` },
  spacious: { label: "Spacious", description: "Premium generous layout", css: `.document-preview p, .document-preview li { line-height: 1.95; }\n.document-preview h2 { margin-top: 52px; margin-bottom: 18px; }\n.document-preview h3 { margin-top: 34px; }\n.document-preview table { margin: 34px 0; }` },
  technical: { label: "Technical", description: "Code & architecture docs", css: `.document-preview { font-family: Arial, sans-serif; }\n.document-preview h2 { color: #4d3d8f; border-left: 4px solid #6b5bb0; padding-left: 12px; }\n.document-preview code { color: #8b2f57; }\n.document-preview pre { border: 1px solid #d8d7df; border-radius: 5px; }` },
  accessible: { label: "Accessible", description: "High contrast & readable", css: `.document-preview { font-family: Arial, sans-serif; color: #111; }\n.document-preview p, .document-preview li { font-size: 14px; line-height: 1.8; }\n.document-preview h1, .document-preview h2, .document-preview h3 { color: #111; }\n.document-preview a { color: #0047ab; text-decoration: underline; }` },
  report: { label: "Annual Report", description: "Metrics & leadership reports", css: `.document-preview { font-family: Arial, sans-serif; }\n.document-preview h1 { color: #15344f; font-size: 46px; border-bottom: 6px solid #d2a84a; }\n.document-preview h2 { color: #15344f; text-transform: uppercase; letter-spacing: .08em; }\n.document-preview th { background: #15344f; }` },
  handbook: { label: "Handbook", description: "Policies & employee guides", css: `.document-preview { font-family: Arial, sans-serif; }\n.document-preview h1 { color: #204d3a; }\n.document-preview h2 { background: #edf4ef; color: #204d3a; padding: 10px 14px; border-radius: 4px; }\n.document-preview blockquote { background: #fff8df; border-color: #c89520; }` },
  twoColumn: { label: "Two Column", description: "Magazine-style long-form", css: `.document-preview { column-count: 2; column-gap: 34px; column-rule: 1px solid #ddd; }\n.document-preview h1, .document-preview h2, .document-preview h3, .document-preview table, .document-preview pre { column-span: all; }\n.document-preview p { text-align: justify; }` },
  newsletter: { label: "Newsletter", description: "Updates & announcements", css: `.document-preview { font-family: Georgia, serif; }\n.document-preview h1 { color: #8a294e; text-align: center; border-top: 1px solid #8a294e; border-bottom: 1px solid #8a294e; padding: 18px 0; }\n.document-preview h2 { color: #8a294e; }\n.document-preview > p:first-of-type { font-size: 16px; font-style: italic; }` },
  monochrome: { label: "Monochrome", description: "Ink-safe formal printing", css: `.document-preview { color: #111; filter: grayscale(1); }\n.document-preview h1 { border-bottom: 3px solid #111; }\n.document-preview h2, .document-preview h3 { color: #111; }\n.document-preview th { background: #222; }` },
  bordered: { label: "Framed", description: "Premium bordered document", css: `.document-preview { border: 2px solid #27364a; padding: 30px; }\n.document-preview h1 { text-align: center; color: #27364a; }\n.document-preview h2 { border-top: 1px solid #8d99a8; padding-top: 12px; color: #27364a; }` },
  blueprint: { label: "Blueprint", description: "Engineering design language", css: `.document-preview { font-family: Arial, sans-serif; color: #143a5a; }\n.document-preview h1 { color: #0c4f7a; text-transform: uppercase; }\n.document-preview h2 { color: #0c4f7a; border-bottom: 2px solid #5fa4cb; }\n.document-preview table { border: 2px solid #0c4f7a; }\n.document-preview code { color: #b23a48; }` },
  printSafe: { label: "Print Safe", description: "Conservative PDF output", css: `.document-preview { font-family: Arial, sans-serif; color: #111; }\n.document-preview * { text-shadow: none !important; box-shadow: none !important; }\n.document-preview h1, .document-preview h2, .document-preview h3 { color: #111; break-after: avoid; }\n.document-preview table, .document-preview blockquote, .document-preview pre { break-inside: avoid; }` },
} as const;

type ThemeKey = keyof typeof themes;

const recommendedRecipes: Record<ThemeKey, CssPresetKey[]> = {
  legal: ["policy", "classic", "compact"],
  srs: ["corporate", "blueprint", "printSafe"],
  architecture: ["technical", "blueprint", "modern"],
  executive: ["report", "corporate", "spacious"],
  editorial: ["newsletter", "twoColumn", "classic"],
  academic: ["classic", "accessible", "printSafe"],
  minimal: ["technical", "monochrome", "compact"],
};

const promptCore = [
  "Create the complete document as raw GitHub-Flavored Markdown (.md). Do not generate, attach, or encode a DOCX/PDF; use the response budget for accurate, useful content.",
  "",
  "OUTPUT CONTRACT",
  "- Return only the finished Markdown document: no preamble, commentary, or code fence around the whole response.",
  "- Use exactly one `#` H1 for the document title, then sequential `##` and `###` headings without skipping levels.",
  "- Keep paragraphs concise, sections complete, terminology consistent, and the hierarchy easy to scan.",
  "- Never invent facts, metrics, quotations, requirements, URLs, or citations. Mark missing inputs as `[TBD: specific information needed]`.",
  "- Do not add HTML, manual page numbers, a manually typed table of contents, base64 data, or decorative filler.",
  "",
  "MARKDOWN TOOLKIT — use each feature only when it improves the document",
  "- `**bold**` for labels or key terms, `_italic_` for light emphasis, and `~~strikethrough~~` only for explicit revisions.",
  "- Unordered `-` lists, ordered `1.` steps, and `- [ ]` task lists for actions or review checklists.",
  "- `> blockquotes` for warnings, decisions, constraints, or important callouts.",
  "- GFM tables with a header and separator row; keep every row the same width and keep cells concise.",
  "- Fenced code blocks with a language tag such as `json`, `yaml`, `bash`, `typescript`, or `sql`; never use a fence around the whole document.",
  "- Mermaid diagrams in a fenced `mermaid` block when a flow, sequence, architecture, state, or dependency diagram adds real value.",
  "- Descriptive links as `[label](https://example.com)` and `---` rules only between major document parts.",
  "- Escape Markdown control characters when they are meant to appear literally.",
].join("\n");
const promptEnd = [
  "",
  "FINAL QUALITY CHECK",
  "- Verify heading order, table column counts, list indentation, code-fence pairing, requirement/decision IDs, and internal consistency.",
  "- Remove empty sections and generic filler. Preserve `[TBD: ...]` markers instead of guessing.",
  "- End with the final document content, ready to save directly as a `.md` file and convert in unmarkdown.in.",
].join("\n");
const promptShapes: Record<ThemeKey, string> = {
  legal: [
    "Build a formal legal or policy document with numbered clauses and precise defined terms.",
    "- Begin with a metadata table for owner, version, status, effective date, jurisdiction, and classification.",
    "- Include Purpose, Scope, Definitions, Obligations, Rights, Exceptions, Compliance, Term/Termination, Disputes, Contacts, and Acceptance/Approval where relevant.",
    "- Use `**Defined Term**` consistently, `> IMPORTANT:` callouts sparingly, and `[TBD: jurisdiction or counsel input]` rather than inventing legal terms.",
    "- End with an approval or revision-history table when the document requires governance.",
  ].join("\n"),
  srs: [
    "Build a review-ready Software Requirements Specification with traceable, testable requirements.",
    "- Include metadata, purpose, scope, stakeholders, system overview, assumptions, constraints, actors, interfaces, data, functional requirements, non-functional requirements, security, and acceptance criteria.",
    "- Use tables for requirements: `ID | Requirement | Rationale | Priority | Verification`, with unique `FR-001` and `NFR-001` identifiers and unambiguous 'shall' statements.",
    "- Add a Mermaid context or workflow diagram when useful, plus a traceability table linking requirements to acceptance tests.",
    "- Flag unresolved requirements as `[TBD: decision/input]`; do not fabricate performance targets.",
  ].join("\n"),
  architecture: [
    "Build a practical software architecture document that explains structure, behavior, operations, and decisions.",
    "- Include goals/non-goals, context, constraints, quality attributes, components, interfaces, data model/flows, security, deployment, scalability, observability, failure handling, and risks.",
    "- Add appropriate Mermaid diagrams for system context, containers/components, sequence, deployment, or data flow; keep each diagram focused and syntactically valid.",
    "- Include an ADR table: `ID | Decision | Status | Rationale | Alternatives | Trade-offs`, plus interface/configuration code blocks with language tags.",
    "- State assumptions and use `[TBD: evidence or decision]` where architecture input is missing.",
  ].join("\n"),
  executive: [
    "Build a concise board-ready business report focused on decisions and evidence.",
    "- Include metadata, Executive Summary, Context, Key Metrics, Insights, Highlights, Risks/Mitigations, Options, Recommendations, Roadmap, and Next Steps.",
    "- Use a KPI table with `Metric | Current | Target | Trend | Commentary`, bullets for findings, and a numbered action plan with owner, due date, and status.",
    "- Put the decision required in a `> DECISION REQUIRED:` callout and mark unavailable figures as `[TBD: metric/source]`.",
    "- Keep the executive summary to five evidence-based points and avoid unsupported claims.",
  ].join("\n"),
  editorial: [
    "Write polished long-form editorial content with a strong narrative and clean reading rhythm.",
    "- Use one compelling headline, an optional italic deck, a purposeful opening, descriptive section headings, concrete examples, and a memorable conclusion.",
    "- Use `> blockquotes` only for genuine quotations or pull quotes, links for supplied sources, and a short Key Takeaways list when useful.",
    "- Do not fabricate quotes, people, studies, or sources; mark research gaps as `[TBD: source or fact check]`.",
    "- Avoid repetitive headings, generic transitions, keyword stuffing, and excessive lists.",
  ].join("\n"),
  academic: [
    "Build a rigorous academic or research paper without inventing evidence or citations.",
    "- Include title, abstract, keywords, introduction, research question, literature context, methodology, results, discussion, limitations, ethics/validity, conclusion, and references as appropriate.",
    "- Use tables for methods or results, fenced blocks for reproducible code, and Mermaid only for a genuine conceptual or methodological flow.",
    "- Cite only sources supplied in the input. Use `[TBD: citation required]` instead of creating authors, journals, DOIs, URLs, or findings.",
    "- Separate observed results from interpretation and state limitations clearly.",
  ].join("\n"),
  minimal: [
    "Build precise developer documentation that is runnable, searchable, and easy to maintain.",
    "- Include overview, requirements, installation, quick start, usage, configuration, API/CLI reference, examples, errors, troubleshooting, security, testing, deployment, and changelog where relevant.",
    "- Use language-tagged code fences, a parameter table `Name | Type | Required | Default | Description`, task lists for setup, and Mermaid for architecture or request flow only when helpful.",
    "- Keep commands copy-ready, separate alternatives clearly, never invent package names or endpoints, and mark unknown values as `[TBD: exact value]`.",
    "- Add expected output after commands when it helps users verify success.",
  ].join("\n"),
};
const promptSamples: Record<ThemeKey, string> = {
  legal: `# Privacy Policy\n\n## 1. Definitions\n**"Service"** refers to the platform provided by…`,
  srs: `# Software Requirements Specification\n\n## 1. Introduction\n| ID | Requirement | Priority |\n| FR-001 | The system shall… | Must |`,
  architecture: `# System Architecture\n\n## 1. Overview\nThe platform is composed of three services…`,
  executive: `# Q3 Business Review\n\n## Executive Summary\nRevenue grew 23% quarter-on-quarter…`,
  editorial: `# The Art of Attention\n\nIn a world of infinite scroll, focus has become…`,
  academic: `# Research Paper\n\n## Abstract\nThis study examines the relationship between…`,
  minimal: `# API Reference\n\n## Quick start\n\`\`\`bash\nnpm install @acme/sdk\n\`\`\``,
};
type CssPresetKey = keyof typeof cssPresets;
type PageSize = "a4" | "letter";
type MarginSize = "narrow" | "normal" | "wide";
type LogoSize = "small" | "standard" | "large";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

const workflowLinks = [
  ["Markdown to Word", "/markdown-to-word"],
  ["Markdown to PDF", "/markdown-to-pdf"],
  ["Markdown to DOCX", "/markdown-to-docx"],
  ["ChatGPT Markdown to Word", "/chatgpt-markdown-to-word"],
  ["SRS document generator", "/srs-document-generator"],
  ["Architecture document template", "/architecture-document-template"],
] as const;

function trackAnalytics(event: string, parameters: Record<string, string | number | boolean>) {
  window.gtag?.("event", event, parameters);
}

type BrandKit = {
  organization: string;
  accent: string;
  footerText: string;
  logo: { src: string; width: number; height: number; format: "png" | "jpg" | "gif" | "bmp" } | null;
  logoOnCover: boolean;
  logoInHeader: boolean;
  logoInFooter: boolean;
  logoSize: LogoSize;
};

function playBulbSwitch(on: boolean) {
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    const now = ctx.currentTime;
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = "square";
    click.frequency.setValueAtTime(on ? 2100 : 1300, now);
    clickGain.gain.setValueAtTime(0.07, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
    click.connect(clickGain).connect(ctx.destination);
    click.start(now);
    click.stop(now + 0.04);
    const hum = ctx.createOscillator();
    const humGain = ctx.createGain();
    hum.type = "sine";
    hum.frequency.setValueAtTime(on ? 420 : 320, now + 0.03);
    hum.frequency.exponentialRampToValueAtTime(on ? 780 : 160, now + 0.16);
    humGain.gain.setValueAtTime(0.0001, now + 0.03);
    humGain.gain.exponentialRampToValueAtTime(0.08, now + 0.06);
    humGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    hum.connect(humGain).connect(ctx.destination);
    hum.start(now + 0.03);
    hum.stop(now + 0.24);
    window.setTimeout(() => { void ctx.close(); }, 400);
  } catch {}
}

function cleanMarkdownText(value: string): string {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\\([\\`*_[\]{}()#+.!~-])/g, "$1")
    .replace(/[*_~`]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function plainText(token: Tokens.Generic): string {
  if (typeof token.text === "string") return cleanMarkdownText(token.text);
  if (Array.isArray(token.tokens)) return token.tokens.map(plainText).join(" ");
  if (typeof token.raw === "string") return cleanMarkdownText(token.raw.replace(/^#+\s*|^>\s*/g, ""));
  return "";
}

let diagramId = 0;

async function renderMermaidSvg(source: string, accent: string, ink: string) {
  const { default: mermaid } = await import("mermaid");
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    themeVariables: { primaryColor: `${accent}22`, primaryBorderColor: accent, primaryTextColor: ink, lineColor: accent, fontFamily: "Arial, sans-serif" },
  });
  return (await mermaid.render(`unmarkdown-diagram-${++diagramId}`, source)).svg;
}

async function mermaidPng(svg: string) {
  const viewBox = svg.match(/viewBox=["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)["']/i);
  const sourceWidth = Number(viewBox?.[1]) || 800;
  const sourceHeight = Number(viewBox?.[2]) || 450;
  const width = Math.min(560, sourceWidth);
  const height = Math.round(sourceHeight * (width / sourceWidth));
  const blobUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = new Image();
    image.src = blobUrl;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = height * 2;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = Uint8Array.from(atob(canvas.toDataURL("image/png").split(",")[1]), (char) => char.charCodeAt(0));
    return { data, width, height };
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

export default function Home() {
  const [markdown, setMarkdown] = useState(starter);
  const [filename, setFilename] = useState("software-requirements.md");
  const [themeKey, setThemeKey] = useState<ThemeKey>("srs");
  const [customCss, setCustomCss] = useState(".document-preview h1 { letter-spacing: -0.035em; }\n.document-preview table { break-inside: avoid; }");
  const [activePreset, setActivePreset] = useState<CssPresetKey | "custom">("custom");
  const [accentOverride, setAccentOverride] = useState("");
  const [bodySize, setBodySize] = useState(12.5);
  const [lineHeight, setLineHeight] = useState(1.72);
  const [panel, setPanel] = useState<"settings" | "css" | "format" | null>(null);
  const [notice, setNotice] = useState("");
  const [title, setTitle] = useState("Software Requirements Specification");
  const [author, setAuthor] = useState("Product & Engineering Team");
  const [organization, setOrganization] = useState("Your Organization");
  const [version, setVersion] = useState("1.0");
  const [classification, setClassification] = useState("Internal");
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [marginSize, setMarginSize] = useState<MarginSize>("normal");
  const [coverPage, setCoverPage] = useState(true);
  const [tableOfContents, setTableOfContents] = useState(true);
  const [numberedHeadings, setNumberedHeadings] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [zoom, setZoom] = useState(95);
  const [logo, setLogo] = useState<{ src: string; width: number; height: number; format: "png" | "jpg" | "gif" | "bmp" } | null>(null);
  const [logoOnCover, setLogoOnCover] = useState(true);
  const [logoInHeader, setLogoInHeader] = useState(false);
  const [logoInFooter, setLogoInFooter] = useState(false);
  const [logoSize, setLogoSize] = useState<LogoSize>("standard");
  const [footerText, setFooterText] = useState("");
  const [promptCopied, setPromptCopied] = useState(false);
  const [studioLight, setStudioLight] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const userEditedRef = useRef(false);
  const [dropActive, setDropActive] = useState(false);

  const loadSample = async (key: ThemeKey) => {
    try {
      const response = await fetch(`/samples/${key}.md`);
      if (!response.ok) return;
      const text = await response.text();
      setMarkdown(text);
      setFilename(`${key}-sample.md`);
      const heading = text.match(/^#\s+(.+)$/m)?.[1];
      if (heading) setTitle(cleanMarkdownText(heading));
    } catch {}
  };

  const applyStandard = (key: ThemeKey) => {
    setThemeKey(key);
    if (!userEditedRef.current) loadSample(key);
    flash(`${themes[key].label} standard applied.`);
  };

  const fitPreview = () => {
    const scroller = previewRef.current;
    if (!scroller) return;
    const paperWidth = scroller.querySelector<HTMLElement>(".paper")?.offsetWidth || 794;
    const stagePadding = window.innerWidth <= 620 ? 48 : 120;
    setZoom(Math.max(40, Math.min(125, Math.floor(((scroller.clientWidth - stagePadding) / paperWidth) * 100))));
  };

  useEffect(() => {
    if (window.innerWidth >= 700) return;
    const id = window.setTimeout(() => {
      const scroller = document.querySelector<HTMLElement>(".preview-scroll");
      const paperWidth = scroller?.querySelector<HTMLElement>(".paper")?.offsetWidth || 794;
      if (scroller) setZoom(Math.max(40, Math.min(125, Math.floor(((scroller.clientWidth - 48) / paperWidth) * 100))));
    }, 120);
    return () => window.clearTimeout(id);
  }, []);
  const theme = themes[themeKey];
  const activeAccent = accentOverride || theme.accent;
  const logoScale = logoSize === "small" ? 0.72 : logoSize === "large" ? 1.3 : 1;
  const resolvedFooterText = footerText.trim() || `${organization} · ${classification}`;

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        if (localStorage.getItem("studio-light-mode") === "true") setStudioLight(true);
        const raw = localStorage.getItem("unmarkdown-brand-kit");
        if (!raw) return;
        const saved = JSON.parse(raw) as Partial<BrandKit>;
        if (typeof saved.organization === "string") setOrganization(saved.organization);
        if (typeof saved.accent === "string" && /^#[0-9a-f]{6}$/i.test(saved.accent)) setAccentOverride(saved.accent);
        if (typeof saved.footerText === "string") setFooterText(saved.footerText);
        if (typeof saved.logoOnCover === "boolean") setLogoOnCover(saved.logoOnCover);
        if (typeof saved.logoInHeader === "boolean") setLogoInHeader(saved.logoInHeader);
        if (typeof saved.logoInFooter === "boolean") setLogoInFooter(saved.logoInFooter);
        if (["small", "standard", "large"].includes(saved.logoSize ?? "")) setLogoSize(saved.logoSize as LogoSize);
        if (saved.logo && /^data:image\/(?:png|jpeg|gif|bmp);base64,/i.test(saved.logo.src) && saved.logo.width > 0 && saved.logo.height > 0) setLogo(saved.logo);
      } catch {}
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add("in-view"); observer.unobserve(entry.target); }
    }, { threshold: 0.16 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const tilt = (event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--rx", `${((event.clientY - rect.top) / rect.height - 0.5) * -7}deg`);
    element.style.setProperty("--ry", `${((event.clientX - rect.left) / rect.width - 0.5) * 9}deg`);
  };
  const untilt = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  };
  const heroMove = (event: React.MouseEvent<HTMLElement>) => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", String((event.clientX - rect.left) / rect.width - 0.5));
    hero.style.setProperty("--my", String((event.clientY - rect.top) / rect.height - 0.5));
  };

  const deferredMarkdown = useDeferredValue(markdown);
  const isRendering = deferredMarkdown !== markdown;
  const html = useMemo(() => {
    const previewMarkdown = numberedHeadings ? deferredMarkdown.replace(/^(#{2,3})\s+\d+(?:\.\d+)*\.?\s+/gm, "$1 ") : deferredMarkdown;
    const renderer = new Renderer();
    const renderCode = renderer.code.bind(renderer);
    renderer.code = (token) => token.lang?.trim().toLowerCase() === "mermaid"
      ? `<div class="mermaid-diagram" data-source="${encodeURIComponent(token.text)}" role="img" aria-label="Diagram preview"><span>Rendering diagram...</span></div>`
      : renderCode(token);
    const dirty = marked.parse(previewMarkdown, { gfm: true, breaks: true, renderer }) as string;
    return typeof window === "undefined" ? dirty : DOMPurify.sanitize(dirty);
  }, [deferredMarkdown, numberedHeadings]);
  const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 220));
  const padding = marginSize === "narrow" ? "42px" : marginSize === "wide" ? "88px" : "68px";

  useEffect(() => {
    const diagrams = Array.from(previewRef.current?.querySelectorAll<HTMLElement>(".mermaid-diagram") ?? []);
    if (!diagrams.length) return;
    let cancelled = false;
    void (async () => {
      for (const diagram of diagrams) {
        try {
          const svg = await renderMermaidSvg(decodeURIComponent(diagram.dataset.source ?? ""), activeAccent, theme.ink);
          if (!cancelled) diagram.innerHTML = DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } });
        } catch {
          if (!cancelled) {
            diagram.classList.add("diagram-error");
            diagram.textContent = "Diagram could not be rendered. Check the Mermaid syntax.";
          }
        }
      }
    })();
    return () => { cancelled = true; };
  }, [html, activeAccent, theme.ink]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const openFile = (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      flash("Please choose a Markdown file smaller than 5 MB.");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".md") && file.type !== "text/markdown") {
      flash("Please choose a Markdown (.md) file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result ?? "");
      userEditedRef.current = true;
      setShowStart(false);
      setMarkdown(value);
      setFilename(file.name);
      trackAnalytics("markdown_upload", { file_size_bytes: file.size, selected_standard: themeKey });
      const rawLines = value.split(/\r?\n/);
      const firstHeading = cleanMarkdownText(value.match(/^#\s+(.+)$/m)?.[1] ?? "");
      const lines = rawLines.map((line) => cleanMarkdownText(line.replace(/^#+\s*|^>\s*/g, ""))).filter(Boolean);
      const namedLine = lines.slice(0, 60).filter((line) => line.length <= 100 && /privacy policy|terms(?: of (?:use|service))?|user agreement|cookie policy|refund policy|acceptable use|service agreement/i.test(line)).sort((a, b) => a.length - b.length)[0];
      const boldTitles = rawLines.slice(0, 20).map((line) => line.match(/^\s*(?:\*\*|__)(.+?)(?:\*\*|__)\s*$/)?.[1]).filter((line): line is string => Boolean(line)).map(cleanMarkdownText).filter((line) => line.length <= 70 && !/^(version|status|date|for|prepared)/i.test(line));
      const filenameTitle = file.name.replace(/\.md$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
      const headingIsSection = /^\d+(?:\.\d+)*[.)]?\s+/.test(firstHeading);
      const boldTitle = boldTitles.length >= 2 ? `${boldTitles[0]} — ${boldTitles[1]}` : boldTitles[0];
      const detectedTitle = (!headingIsSection && firstHeading) || boldTitle || namedLine || filenameTitle || "Untitled Document";
      const fingerprint = `${file.name}\n${value.slice(0, 3500)}`.toLowerCase();
      setTitle(detectedTitle);
      if (boldTitles[0] && boldTitles[0].length <= 40) setOrganization(boldTitles[0]);
      if (/architecture|system design|technical design|technical specification|engineering specification/.test(fingerprint)) {
        setThemeKey("architecture");
        setCustomCss(cssPresets.technical.css);
        setActivePreset("technical");
      } else if (/requirement|\bsrs\b/.test(fingerprint)) {
        setThemeKey("srs");
        setCustomCss(cssPresets.corporate.css);
        setActivePreset("corporate");
      } else if (/privacy|terms|policy|agreement|legal|cookie/.test(fingerprint)) {
        setThemeKey("legal");
        setCustomCss(cssPresets.policy.css);
        setActivePreset("policy");
        const owner = detectedTitle.match(/^(.+?)\s+(?:privacy policy|terms|policy|agreement)/i)?.[1];
        if (owner && owner.length <= 40) setOrganization(owner);
      } else if (/research|abstract|methodology|bibliography/.test(fingerprint)) {
        setThemeKey("academic");
        setCustomCss(cssPresets.classic.css);
        setActivePreset("classic");
      }
      document.querySelector("#studio")?.scrollIntoView({ behavior: "smooth" });
      setPanel("format");
      flash("Markdown loaded — pick or confirm a document format.");
    };
    reader.readAsText(file);
  };

  const openLogo = (file?: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      flash("Please choose a logo smaller than 2 MB.");
      return;
    }
    const format = ({ "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/bmp": "bmp" } as const)[file.type];
    if (!format) {
      flash("Please choose a PNG, JPG, GIF or BMP logo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result ?? "");
      const img = new Image();
      img.onload = () => {
        setLogo({ src, width: img.naturalWidth, height: img.naturalHeight, format });
        flash("Logo added to the cover page.");
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const saveBrandKit = () => {
    try {
      const brandKit: BrandKit = { organization, accent: accentOverride, footerText, logo, logoOnCover, logoInHeader, logoInFooter, logoSize };
      localStorage.setItem("unmarkdown-brand-kit", JSON.stringify(brandKit));
      flash("Brand kit saved in this browser.");
    } catch {
      flash("Couldn't save the brand kit. Try a smaller logo.");
    }
  };

  const forgetBrandKit = () => {
    try { localStorage.removeItem("unmarkdown-brand-kit"); } catch {}
    flash("Saved brand kit removed. Current document is unchanged.");
  };

  const applyEdit = (nextValue: string, selectionStart: number, selectionEnd: number) => {
    userEditedRef.current = true;
    setShowStart(false);
    setMarkdown(nextValue);
    requestAnimationFrame(() => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(selectionStart, selectionEnd);
    });
  };
  const wrapSelection = (before: string, after = before, placeholder = "text") => {
    const el = editorRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value } = el;
    const selected = value.slice(start, end) || placeholder;
    applyEdit(value.slice(0, start) + before + selected + after + value.slice(end), start + before.length, start + before.length + selected.length);
  };
  const insertBlock = (snippet: string) => {
    const el = editorRef.current;
    if (!el) return;
    const { selectionEnd: end, value } = el;
    const needsBreak = end > 0 && value[end - 1] !== "\n" ? "\n\n" : end > 0 ? "\n" : "";
    const inserted = needsBreak + snippet + "\n";
    applyEdit(value.slice(0, end) + inserted + value.slice(end), end + inserted.length, end + inserted.length);
  };

  const startWriting = () => {
    const blankDocument = "# Untitled Document\n\n";
    userEditedRef.current = true;
    setShowStart(false);
    setMarkdown(blankDocument);
    setFilename("untitled.md");
    setTitle("Untitled Document");
    setPanel(null);
    requestAnimationFrame(() => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.focus();
      editor.setSelectionRange(blankDocument.length, blankDocument.length);
    });
  };

  const toggleStudioLight = () => {
    const next = !studioLight;
    playBulbSwitch(next);
    const wrap = document.querySelector(".studio-wrap");
    wrap?.classList.add("theming");
    window.setTimeout(() => wrap?.classList.remove("theming"), 900);
    setStudioLight(next);
    try { localStorage.setItem("studio-light-mode", String(next)); } catch {}
    flash(next ? "Lights on — studio switched to light mode." : "Lights off — studio back to dark mode.");
  };

  const activePrompt = `${promptCore}\n\nDOCUMENT STANDARD\n${promptShapes[themeKey]}\n${promptEnd}`;
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(activePrompt);
      setPromptCopied(true);
      window.setTimeout(() => setPromptCopied(false), 2800);
      flash(`${themes[themeKey].label} prompt copied — paste it into any AI chat.`);
    } catch {
      flash("Couldn't access the clipboard — select and copy the prompt manually.");
    }
  };

  const exportPdf = async () => {
    if (isPdfExporting || !paperRef.current) return;
    setIsPdfExporting(true);
    flash("Building your PDF from the document preview…");
    const paper = paperRef.current;
    const previousZoom = paper.style.zoom;
    paper.style.zoom = "1";
    paper.classList.add("pdf-export-source");
    try {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const { default: html2pdf } = await import("html2pdf.js");
      const scale = Math.min(2, 28000 / Math.max(paper.scrollHeight, 1));
      await html2pdf().set({
        margin: 0,
        filename: filename.replace(/\.md$/i, "") + ".pdf",
        image: { type: "jpeg", quality: 0.98 },
        enableLinks: true,
        html2canvas: { scale, useCORS: true, backgroundColor: theme.paper, logging: false, windowWidth: paper.scrollWidth },
        jsPDF: { unit: "mm", format: pageSize, orientation: "portrait" },
      }).from(paper).save();
      trackAnalytics("pdf_export", { selected_standard: themeKey, page_size: pageSize });
      flash("PDF downloaded.");
    } catch {
      flash("Couldn't build the PDF. Try a shorter document or export DOCX instead.");
    } finally {
      paper.classList.remove("pdf-export-source");
      paper.style.zoom = previousZoom;
      setIsPdfExporting(false);
    }
  };

  const buildDocx = async () => {
    flash("Building your professional Word document…");
    const {
      AlignmentType, BorderStyle, Document, Footer, Header, HeadingLevel, ImageRun, PageBreak, PageNumber,
      Packer, Paragraph, ShadingType, Table, TableCell, TableOfContents, TableRow, TextRun,
      VerticalAlign, WidthType,
    } = await import("docx");
    const tokens = marked.lexer(markdown);
    const accent = activeAccent.slice(1);
    const ink = theme.ink.slice(1);
    const children: Array<InstanceType<typeof Paragraph> | InstanceType<typeof Table> | InstanceType<typeof TableOfContents>> = [];
    const margins = marginSize === "narrow" ? 720 : marginSize === "wide" ? 1440 : 1080;
    const page = pageSize === "letter" ? { width: 12240, height: 15840 } : { width: 11906, height: 16838 };
    const run = (text: string, options: { bold?: boolean; italics?: boolean; code?: boolean; color?: string } = {}) => new TextRun({
      text,
      bold: options.bold,
      italics: options.italics,
      font: options.code ? "Aptos Mono" : theme.wordFont,
      color: options.color ?? ink,
      size: options.code ? 19 : 22,
    });

    const logoData = logo ? Uint8Array.from(atob(logo.src.split(",")[1]), (char) => char.charCodeAt(0)) : null;
    const logoImage = (targetHeight: number, maxWidth: number) => {
      let height = Math.min(Math.round(targetHeight * logoScale), logo!.height);
      let width = Math.round(logo!.width * (height / logo!.height));
      if (width > maxWidth) {
        width = maxWidth;
        height = Math.round(logo!.height * (width / logo!.width));
      }
      return new ImageRun({ data: logoData!, transformation: { width, height }, type: logo!.format });
    };
    const coverLogo = Boolean(logo && logoOnCover);

    if (coverPage) {
      if (coverLogo) children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 700, after: 200 }, children: [logoImage(52, 220)] }));
      children.push(
        new Paragraph({ text: organization.toUpperCase(), alignment: AlignmentType.CENTER, spacing: { before: coverLogo ? 200 : 900, after: 700 }, style: "CoverEyebrow" }),
        new Paragraph({ text: title, alignment: AlignmentType.CENTER, style: "CoverTitle", spacing: { after: 320 } }),
        new Paragraph({ text: `${themes[themeKey].label} document`, alignment: AlignmentType.CENTER, style: "Subtitle", spacing: { after: 900 } }),
        new Paragraph({ text: `Prepared by ${author}`, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
        new Paragraph({ text: `Version ${version}  •  ${classification}`, alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
        new Paragraph({ text: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [new PageBreak()] }),
      );
    }

    if (tableOfContents) {
      children.push(new Paragraph({ text: "Table of contents", heading: HeadingLevel.HEADING_1, spacing: { after: 240 } }));
      children.push(new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-3" }));
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    let sectionNumber = 0;
    let subsectionNumber = 0;
    for (const token of tokens) {
      if (token.type === "heading") {
        const level = token.depth === 1 ? HeadingLevel.TITLE : token.depth === 2 ? HeadingLevel.HEADING_1 : token.depth === 3 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3;
        const cleanHeading = plainText(token).replace(/^\d+(?:\.\d+)*\.?\s+/, "");
        let headingText = plainText(token);
        if (numberedHeadings && token.depth === 2) { sectionNumber += 1; subsectionNumber = 0; headingText = `${sectionNumber}. ${cleanHeading}`; }
        if (numberedHeadings && token.depth === 3) { subsectionNumber += 1; headingText = `${sectionNumber}.${subsectionNumber} ${cleanHeading}`; }
        children.push(new Paragraph({ text: headingText, heading: level, spacing: { before: token.depth === 1 ? 0 : 300, after: 120 }, keepNext: true }));
      } else if (token.type === "paragraph" || token.type === "text") {
        children.push(new Paragraph({ children: [run(plainText(token))], spacing: { after: 180, line: 330 }, widowControl: true }));
      } else if (token.type === "blockquote") {
        children.push(new Paragraph({ children: [run(plainText(token), { italics: true, color: accent })], indent: { left: 420, right: 220 }, border: { left: { style: BorderStyle.SINGLE, size: 16, color: accent, space: 14 } }, shading: { type: ShadingType.CLEAR, fill: "F5F6F8" }, spacing: { before: 160, after: 200 } }));
      } else if (token.type === "list") {
        for (const item of token.items) children.push(new Paragraph({ children: [run(plainText(item))], bullet: token.ordered ? undefined : { level: 0 }, numbering: token.ordered ? { reference: "numbered-list", level: 0 } : undefined, spacing: { after: 90, line: 300 } }));
      } else if (token.type === "code" && token.lang?.trim().toLowerCase() === "mermaid") {
        try {
          const image = await mermaidPng(await renderMermaidSvg(token.text, activeAccent, theme.ink));
          children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ data: image.data, transformation: { width: image.width, height: image.height }, type: "png" })], spacing: { before: 180, after: 220 } }));
        } catch {
          children.push(new Paragraph({ children: [run(`Diagram source\n${token.text}`, { code: true })], shading: { type: ShadingType.CLEAR, fill: "F1F3F5" }, spacing: { before: 140, after: 200 } }));
        }
      } else if (token.type === "code") {
        children.push(new Paragraph({ children: [run(token.text, { code: true })], shading: { type: ShadingType.CLEAR, fill: "F1F3F5" }, border: { left: { style: BorderStyle.SINGLE, size: 10, color: accent, space: 10 } }, spacing: { before: 140, after: 200 }, indent: { left: 180, right: 180 } }));
      } else if (token.type === "hr") {
        children.push(new Paragraph({ text: "", border: { bottom: { style: BorderStyle.SINGLE, size: 5, color: "CCD1D6", space: 8 } }, spacing: { before: 160, after: 160 } }));
      } else if (token.type === "table") {
        const rows = [token.header, ...token.rows].map((row, rowIndex) => new TableRow({
          tableHeader: rowIndex === 0,
          children: row.map((cell: { text: string }) => new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            shading: rowIndex === 0 ? { type: ShadingType.CLEAR, fill: accent } : undefined,
            margins: { top: 110, bottom: 110, left: 130, right: 130 },
            children: [new Paragraph({ children: [run(cell.text, { bold: rowIndex === 0, color: rowIndex === 0 ? "FFFFFF" : ink })], spacing: { after: 0 } })],
          })),
        }));
        children.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCD1D6" }, bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCD1D6" }, left: { style: BorderStyle.SINGLE, size: 4, color: "CCD1D6" }, right: { style: BorderStyle.SINGLE, size: 4, color: "CCD1D6" }, insideHorizontal: { style: BorderStyle.SINGLE, size: 3, color: "DDE1E5" }, insideVertical: { style: BorderStyle.SINGLE, size: 3, color: "DDE1E5" } } }));
        children.push(new Paragraph({ text: "", spacing: { after: 120 } }));
      }
    }

    const doc = new Document({
      creator: author,
      title,
      subject: themes[themeKey].category,
      description: `Generated by unmarkdown.in from ${filename}`,
      styles: {
        default: { document: { run: { font: theme.wordFont, size: 22, color: ink }, paragraph: { spacing: { line: 330 } } } },
        paragraphStyles: [
          { id: "CoverEyebrow", name: "Cover Eyebrow", basedOn: "Normal", run: { font: theme.wordFont, size: 18, bold: true, color: accent, characterSpacing: 80 } },
          { id: "CoverTitle", name: "Cover Title", basedOn: "Title", run: { font: theme.wordFont, size: 48, bold: true, color: ink } },
          { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: theme.wordFont, size: 40, bold: true, color: ink }, paragraph: { spacing: { before: 120, after: 260 }, outlineLevel: 0 } },
          { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: theme.wordFont, size: 30, bold: true, color: accent }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0, keepNext: true } },
          { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: theme.wordFont, size: 25, bold: true, color: ink }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1, keepNext: true } },
          { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: theme.wordFont, size: 22, bold: true, color: accent }, paragraph: { spacing: { before: 220, after: 100 }, outlineLevel: 2, keepNext: true } },
        ],
      },
      numbering: {
        config: [
          { reference: "numbered-list", levels: [{ level: 0, format: "decimal", text: "%1.", alignment: AlignmentType.START, style: { paragraph: { indent: { left: 720, hanging: 260 } } } }] },
        ],
      },
      sections: [{
        properties: { page: { size: page, margin: { top: margins, right: margins, bottom: margins, left: margins } } },
        headers: showHeader ? { default: new Header({ children: [new Paragraph({ children: [...(logo && logoInHeader ? [logoImage(22, 120), run("   ")] : []), run(`${organization}  /  ${title}`, { bold: true, color: "6C737A" })], border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: "D8DCE0", space: 6 } } })] }) } : undefined,
        footers: showFooter ? { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run(resolvedFooterText, { color: "747A80" }), ...(logo && logoInFooter ? [run("   "), logoImage(16, 90)] : []), ...(showPageNumbers ? [run("   •   ", { color: "747A80" }), new TextRun({ children: [PageNumber.CURRENT], font: theme.wordFont, size: 18, color: "747A80" })] : [])] })] }) } : undefined,
        children,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.replace(/\.md$/i, "") + ".docx";
    a.click();
    trackAnalytics("docx_export", { selected_standard: themeKey, page_size: pageSize });
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash("Professional DOCX downloaded.");
  };

  const exportDocx = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await buildDocx();
    } catch {
      flash("Couldn't build the DOCX. Check the document and try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const formatPanel = <aside className="inspector-pane format-pane">
    <div className="pane-label"><span>DOCUMENT FORMAT</span><button onClick={() => setPanel(null)}>×</button></div>
    <div className="inspector-scroll">
      <div className="format-intro"><b>Pick a professional standard</b><p>Switch any time — before or after uploading. The preview and both exports update instantly.</p></div>
      <div className="format-grid">
        {(Object.keys(themes) as ThemeKey[]).map((key) => {
          const option = themes[key];
          return <button key={key} className={`format-option ${themeKey === key ? "selected" : ""}`} onClick={() => applyStandard(key)}>
            <span className="format-swatch" style={{ background: option.paper, color: option.ink, fontFamily: option.font }}><i style={{ background: option.accent }}/>{option.sample.split("\n")[0]}</span>
            <span className="format-meta"><b>{option.label}</b><small>{option.category}</small><em>{option.description}</em></span>
            <span className="format-check">{themeKey === key ? "✓" : "→"}</span>
          </button>;
        })}
      </div>
      <div className="format-sample">
        <button onClick={() => { if (!userEditedRef.current || window.confirm("Replace the current Markdown with this standard's sample document?")) { userEditedRef.current = false; loadSample(themeKey); flash(`${theme.label} sample loaded.`); } }}>↺ Load a {theme.label} sample document</button>
      </div>
      <div className="format-recipes">
        <div className="style-section-title"><span>Suggested layouts · {theme.label}</span></div>
        <div className="recipe-chips">
          {recommendedRecipes[themeKey].map((key) => <button key={key} className={activePreset === key ? "selected" : ""} onClick={() => { setCustomCss(cssPresets[key].css); setActivePreset(key); flash(`${cssPresets[key].label} layout applied.`); }}><b>{cssPresets[key].label}</b><small>{cssPresets[key].description}</small></button>)}
        </div>
        <p className="setting-note">Need more? The Style Lab has all {Object.keys(cssPresets).length} layout recipes plus unrestricted custom CSS.</p>
      </div>
    </div>
  </aside>;

  const settingsPanel = <aside className="inspector-pane">
    <div className="pane-label"><span>COMPANY &amp; DOCUMENT</span><button onClick={() => setPanel(null)}>×</button></div>
    <div className="inspector-scroll">
      <div className="setting-section"><b>Company setup</b>
        <label>Organization<input value={organization} onChange={(e) => setOrganization(e.target.value)} /></label>
        <label>Brand colour<div className="brand-color"><input aria-label="Brand colour" type="color" value={activeAccent} onChange={(e) => setAccentOverride(e.target.value)} /><button onClick={() => setAccentOverride("")}>Use theme colour</button></div></label>
        <label>Company logo</label>
        <div className="logo-row">{logo ? <><img src={logo.src} alt="Logo preview" /><button onClick={() => setLogo(null)}>Remove</button></> : <button onClick={() => logoRef.current?.click()}>Upload logo</button>}</div>
        {logo && <div className="logo-placement">{[["Cover page", logoOnCover, setLogoOnCover], ["Header", logoInHeader, setLogoInHeader], ["Footer", logoInFooter, setLogoInFooter]].map(([label, value, setter]) => <button key={String(label)} className={value ? "selected" : ""} onClick={() => (setter as (value: boolean) => void)(!value)}>{String(label)}</button>)}</div>}
        {logo && <label>Logo size<div className="segmented three">{(["small", "standard", "large"] as LogoSize[]).map((size) => <button key={size} className={logoSize === size ? "selected" : ""} onClick={() => setLogoSize(size)}>{size[0].toUpperCase() + size.slice(1)}</button>)}</div></label>}
        <label>Footer text<input value={footerText} placeholder={`${organization} · ${classification}`} onChange={(e) => setFooterText(e.target.value)} /></label>
        <div className="brand-actions"><button onClick={saveBrandKit}>Save company style</button><button onClick={forgetBrandKit}>Forget saved</button></div>
        <p className="brand-note">Saved only in this browser. Logos must be under 2 MB.</p>
      </div>
      <div className="setting-section"><b>Document identity</b>
        <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label>Author<input value={author} onChange={(e) => setAuthor(e.target.value)} /></label>
        <div className="field-row"><label>Version<input value={version} onChange={(e) => setVersion(e.target.value)} /></label><label>Classification<input value={classification} onChange={(e) => setClassification(e.target.value)} /></label></div>
      </div>
      <div className="setting-section"><b>Page setup</b>
        <div className="segmented"><button className={pageSize === "a4" ? "selected" : ""} onClick={() => setPageSize("a4")}>A4</button><button className={pageSize === "letter" ? "selected" : ""} onClick={() => setPageSize("letter")}>Letter</button></div>
        <label>Margins<select value={marginSize} onChange={(e) => setMarginSize(e.target.value as MarginSize)}><option value="narrow">Narrow</option><option value="normal">Professional</option><option value="wide">Wide</option></select></label>
      </div>
      <div className="setting-section"><b>Document structure</b>
        {[["Cover page", coverPage, setCoverPage], ["Table of contents", tableOfContents, setTableOfContents], ["Numbered heading style", numberedHeadings, setNumberedHeadings], ["Running header", showHeader, setShowHeader], ["Footer", showFooter, setShowFooter], ["Page numbers", showPageNumbers, setShowPageNumbers]].map(([label, value, setter]) => <label className="toggle" key={String(label)}><span>{String(label)}</span><input type="checkbox" checked={value as boolean} onChange={(e) => (setter as (value: boolean) => void)(e.target.checked)} /></label>)}
      </div>
      <p className="setting-note">These settings are applied to the PDF preview and professional DOCX export.</p>
    </div>
  </aside>;

  const styleLabPanel = <aside className="inspector-pane css-pane">
    <div className="pane-label"><span>STYLE LAB</span><button onClick={() => setPanel(null)}>×</button></div>
    <div className="style-lab-scroll">
      <div className="style-intro"><b>Design without limits</b><p>Start with a professional recipe, adjust the controls, then edit every CSS detail.</p></div>
      <div className="style-section"><div className="style-section-title"><span>CSS recipes</span><small>{Object.keys(cssPresets).length} presets</small></div>
        <div className="css-preset-grid">{(Object.keys(cssPresets) as CssPresetKey[]).map((key) => <button key={key} className={activePreset === key ? "selected" : ""} onClick={() => { setCustomCss(cssPresets[key].css); setActivePreset(key); }}><b>{cssPresets[key].label}</b><small>{cssPresets[key].description}</small></button>)}</div>
      </div>
      <div className="style-section"><div className="style-section-title"><span>Quick controls</span><button className="reset-style" onClick={() => { setAccentOverride(""); setBodySize(12.5); setLineHeight(1.72); setCustomCss(""); setActivePreset("custom"); }}>Reset</button></div>
        <label className="color-control"><span>Accent colour</span><input type="color" value={activeAccent} onChange={(e) => setAccentOverride(e.target.value)} /></label>
        <label className="range-control"><span>Body size <b>{bodySize}px</b></span><input type="range" min="10" max="16" step="0.5" value={bodySize} onChange={(e) => setBodySize(Number(e.target.value))} /></label>
        <label className="range-control"><span>Line height <b>{lineHeight.toFixed(2)}</b></span><input type="range" min="1.3" max="2.1" step="0.05" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} /></label>
      </div>
      <div className="style-section css-editor-section"><div className="style-section-title"><span>Custom CSS</span><small>Always enabled</small></div><textarea aria-label="Custom CSS editor" value={customCss} onChange={(e) => { setCustomCss(e.target.value); setActivePreset("custom"); }} spellCheck="false"/><small>Target the page with <code>.document-preview</code>. Changes appear instantly and are included in PDF.</small></div>
    </div>
  </aside>;

  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="unmarkdown.in home"><span className="brand-mark" aria-hidden="true">M<i>↓</i></span><span className="brand-name">unmarkdown<em>.in</em></span></a>
        <div className="nav-links"><a href="#idea">The idea</a><a href="#features">Features</a><a href="#templates">Standards</a><a href="#studio">Studio</a></div>
        <a className="nav-cta" href="#studio">Open Studio <span>↓</span></a>
      </nav>

      <section className="hero shell" id="top" ref={heroRef} onMouseMove={heroMove}>
        <div className="eyebrow"><span /> The missing step after your AI chat</div>
        <h1>AI writes Markdown.<br/><em>unmarkdown.in makes it official.</em></h1>
        <p className="hero-copy">Asking an AI to generate a Word file burns tokens on formatting instead of thinking. Markdown is what models write best — fast, cheap, clean. Bring that Markdown here and leave with a boardroom-ready DOCX or PDF.</p>
        <div className="hero-actions">
          <div
            className={`hero-upload ${dropActive ? "dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDropActive(true); }}
            onDragLeave={() => setDropActive(false)}
            onDrop={(e) => { e.preventDefault(); setDropActive(false); openFile(e.dataTransfer.files?.[0]); }}
          >
            <button className="primary" onClick={() => fileRef.current?.click()}>Choose .md file <span>↑</span></button>
            <div><b>or drop your Markdown here</b><small>Private in your browser · up to 5 MB</small></div>
          </div>
          <a className="secondary" href="#studio">Explore the studio</a>
        </div>
        <p className="privacy"><span>✓</span> Private by design — your Markdown never leaves your browser</p>
        <ol className="hero-flow" aria-label="How unmarkdown.in works">
          <li><span>01</span><b>Ask your AI for Markdown</b><small>&ldquo;Give me the report as .md&rdquo; — a fraction of the tokens a DOCX skill costs</small></li>
          <li className="flow-arrow" aria-hidden="true">→</li>
          <li><span>02</span><b>Drop it into unmarkdown.in</b><small>Choose the right document standard and preview the polished result instantly</small></li>
          <li className="flow-arrow" aria-hidden="true">→</li>
          <li><span>03</span><b>Export DOCX or PDF</b><small>Real Word styles, cover page, table of contents, page numbers</small></li>
        </ol>
        <div className="hero-scene" aria-hidden="true">
          <div className="doc3d">
            <div className="doc3d-float">
              <div className="doc3d-page doc3d-md"><span>report.md</span><i className="l h"/><i className="l"/><i className="l s"/><i className="l"/><i className="l h2"/><i className="l"/><i className="l s"/><i className="l"/></div>
              <div className="doc3d-page doc3d-doc"><span>report.docx</span><i className="l t"/><i className="l a"/><i className="l"/><i className="l s"/><div className="doc3d-table"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><i className="l"/><i className="l s"/></div>
              <span className="doc3d-badge">6× fewer tokens</span>
              <span className="doc3d-flow">→</span>
            </div>
            <div className="doc3d-shadow"/>
          </div>
        </div>
      </section>

      <section className="prompt-idea shell reveal" id="idea">
        <div className="idea-copy">
          <span className="section-kicker">THE CORE IDEA</span>
          <h2>Don&apos;t ask AI for a Word file.<br/><em>Ask for Markdown.</em></h2>
          <p>When an AI builds a DOCX or PDF, most of its tokens go into invisible XML and formatting instructions — thinking budget wasted on plumbing. One line in your chat changes everything: ask for Markdown in your document&apos;s professional standard, then convert it here into a boardroom-ready file.</p>
          <button className="primary copy-btn" onClick={copyPrompt}>{promptCopied ? "✓ Copied — paste it into your AI chat" : `Copy the ${themes[themeKey].label} prompt`} <span>⧉</span></button>
        </div>
        <div className="chat-side">
          <div className="standard-chips" role="tablist" aria-label="Choose a document standard for the prompt">
            {(Object.keys(themes) as ThemeKey[]).map((key) => <button key={key} role="tab" aria-selected={themeKey === key} className={themeKey === key ? "selected" : ""} onClick={() => setThemeKey(key)}>{themes[key].label}</button>)}
          </div>
          <div className="chat-mock tilt-card" onMouseMove={tilt} onMouseLeave={untilt}>
            <div className="chat-title"><i/><i/><i/><span>Any AI chat — ChatGPT, Claude, Gemini…</span></div>
            <div className="bubble user"><small>You</small><p>&ldquo;{activePrompt}&rdquo;</p></div>
            <div className="bubble ai"><small>AI</small><pre>{promptSamples[themeKey]}</pre><span className="bubble-note">✓ pure content · ~6× fewer tokens · already in {themes[themeKey].label} structure</span></div>
            <div className="chat-next">Then drop the .md file into <b>unmarkdown.in →</b></div>
          </div>
        </div>
      </section>

      <section className={`studio-wrap ${studioLight ? "light" : ""}`} id="studio">
        <div className={`bulb-rig ${studioLight ? "on" : ""}`}>
          <button className="bulb" onClick={toggleStudioLight} aria-pressed={studioLight} aria-label={studioLight ? "Turn the studio lights off" : "Turn the studio lights on"} title={studioLight ? "Pull to turn the lights off" : "Pull to turn the lights on"}>
            <span className="bulb-cord"/>
            <span className="bulb-cap"/>
            <span className="bulb-glass"><span className="bulb-filament"/></span>
            <span className="bulb-glow"/>
          </button>
        </div>
        <div className="studio-heading shell"><div><span className="section-kicker">THE DOCUMENT STUDIO</span><h2>One source.<br/><em>Publication quality.</em></h2></div><p>Apply professional structure, page settings and Word styles to any uploaded Markdown file.</p></div>
        <div className="studio shell-wide">
          <div className="studio-bar">
            <div className="file-name"><span className="file-mark">MD</span><div><b>{filename}</b><small>{themes[themeKey].label} · {pageSize.toUpperCase()}</small></div></div>
            <div className="bar-tools">
              <button className={panel === "format" ? "active" : ""} onClick={() => setPanel(panel === "format" ? null : "format")}>⊞ Format</button>
              <button className={panel === "settings" ? "active" : ""} onClick={() => setPanel(panel === "settings" ? null : "settings")}>⚙ Company &amp; document</button>
              <button className={panel === "css" ? "active" : ""} onClick={() => setPanel(panel === "css" ? null : "css")}>✦ Style Lab</button>
              <span className="divider"/><button disabled={isPdfExporting} onClick={exportPdf}>{isPdfExporting ? "Building PDF…" : "↓ PDF"}</button><button className="export" disabled={isExporting} onClick={exportDocx}>{isExporting ? "Building DOCX…" : "↓ Professional DOCX"}</button>
            </div>
          </div>
          {showStart && <div className="studio-start" role="region" aria-label="Start a document">
            <div><small>TRY THE STUDIO</small><b>Start fresh or explore a ready-made document</b></div>
            <div className="studio-start-actions">
              <button onClick={startWriting}>✎ Start writing</button>
              <button onClick={() => { setShowStart(false); editorRef.current?.focus(); }}>↺ Explore sample</button>
            </div>
          </div>}
          <div className="workspace">
            <section
              className={`editor-pane ${dropActive ? "drop-active" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDropActive(true); }}
              onDragLeave={() => setDropActive(false)}
              onDrop={(e) => { e.preventDefault(); setDropActive(false); openFile(e.dataTransfer.files?.[0]); }}
            >
              <div className="pane-label"><span>MARKDOWN SOURCE</span><span>{words} words · {readingTime} min</span></div>
              <div className="editor-toolbar" role="toolbar" aria-label="Markdown formatting">
                <button title="Heading 2" onClick={() => insertBlock("## Section title")}>H2</button>
                <button title="Heading 3" onClick={() => insertBlock("### Subsection")}>H3</button>
                <span className="tool-sep" aria-hidden="true"/>
                <button title="Bold" onClick={() => wrapSelection("**")}><b>B</b></button>
                <button title="Italic" onClick={() => wrapSelection("*")}><i>I</i></button>
                <button title="Strikethrough" onClick={() => wrapSelection("~~")}><s>S</s></button>
                <button title="Inline code" onClick={() => wrapSelection("`", "`", "code")}>{"</>"}</button>
                <span className="tool-sep" aria-hidden="true"/>
                <button title="Bullet list" onClick={() => insertBlock("- First point\n- Second point\n- Third point")}>• List</button>
                <button title="Numbered list" onClick={() => insertBlock("1. First step\n2. Second step\n3. Third step")}>1. Steps</button>
                <button title="Quote" onClick={() => insertBlock("> A line worth highlighting.")}>❝ Quote</button>
                <span className="tool-sep" aria-hidden="true"/>
                <button title="Table" onClick={() => insertBlock("| Column | Column | Column |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n| Cell | Cell | Cell |")}>▦ Table</button>
                <button title="Code block" onClick={() => insertBlock("```\ncode here\n```")}>Code</button>
                <button title="Insert flowchart diagram" onClick={() => insertBlock("```mermaid\nflowchart LR\n  A[Start] --> B[Review]\n  B --> C[Export]\n```")}>◇ Diagram</button>
                <button title="Link" onClick={() => wrapSelection("[", "](https://example.com)", "link text")}>↗ Link</button>
                <button title="Horizontal rule" onClick={() => insertBlock("---")}>— Rule</button>
              </div>
              <textarea ref={editorRef} aria-label="Markdown editor" value={markdown} onChange={(e) => { userEditedRef.current = true; setShowStart(false); setMarkdown(e.target.value); }} spellCheck="false" />
              {dropActive && <div className="drop-hint">Drop your .md file to load it</div>}
            </section>
            <section className="preview-pane">
              <div className="pane-label preview-toolbar"><span>DOCUMENT PREVIEW · {pageSize.toUpperCase()}</span><div className="preview-actions"><button aria-label="Zoom out" onClick={() => setZoom(Math.max(40, zoom - 10))}>−</button><span>{zoom}%</span><button aria-label="Zoom in" onClick={() => setZoom(Math.min(125, zoom + 10))}>＋</button><button className="fit-button" onClick={fitPreview}>Fit</button><span className={`live ${isRendering ? "busy" : ""}`}><i/> {isRendering ? "Rendering…" : "Live"}</span></div></div>
              <div className="preview-scroll" ref={previewRef} tabIndex={0} aria-label="Scrollable document preview">
                <div className="page-stage">
                  <div ref={paperRef} key={`${themeKey}-${pageSize}-${marginSize}`} className={`paper document-shell page-${pageSize} margin-${marginSize}`} style={{ "--accent": activeAccent, "--ink": theme.ink, "--paper": theme.paper, "--doc-font": theme.font, "--page-padding": padding, "--body-size": `${bodySize}px`, "--line-height": lineHeight, "--logo-scale": logoScale, zoom: zoom / 100 } as React.CSSProperties}>
                    {showHeader && <div className="paper-header"><span className="header-brand">{logo && logoInHeader && <img src={logo.src} alt="" />}{organization}</span><span>{classification} · V{version}</span></div>}
                    {coverPage && <section className="cover-preview">
                      <button className="cover-remove" title="Remove the cover page (re-enable in Document setup)" onClick={() => { setCoverPage(false); flash("Cover removed — re-enable it in Document setup."); }}>× Remove cover</button>
                      {logo && logoOnCover && <div className="cover-logo"><img src={logo.src} alt={`${organization} logo`} /><button title="Remove logo from cover" onClick={() => setLogoOnCover(false)}>×</button></div>}
                      {!logo && <button className="logo-add" onClick={() => logoRef.current?.click()}>+ Add company logo</button>}
                      <small contentEditable suppressContentEditableWarning spellCheck={false} onBlur={(e) => setOrganization(e.currentTarget.textContent?.trim() || organization)}>{organization}</small>
                      <h1 contentEditable suppressContentEditableWarning spellCheck={false} onBlur={(e) => setTitle(e.currentTarget.textContent?.trim() || title)}>{title}</h1>
                      <p>{themes[themeKey].category}</p>
                      <div>
                        <span contentEditable suppressContentEditableWarning spellCheck={false} onBlur={(e) => setAuthor(e.currentTarget.textContent?.trim() || author)}>{author}</span>
                        <span>Version <span contentEditable suppressContentEditableWarning spellCheck={false} onBlur={(e) => setVersion(e.currentTarget.textContent?.trim() || version)}>{version}</span></span>
                      </div>
                      <em className="cover-hint">Click any line to edit</em>
                    </section>}
                    <article className={`document-preview theme-${themeKey} ${numberedHeadings ? "numbered-headings" : ""}`} dangerouslySetInnerHTML={{ __html: html }} />
                    {showFooter && <div className="paper-footer"><span>{resolvedFooterText}</span>{logo && logoInFooter && <img className="footer-logo" src={logo.src} alt="" />}{showPageNumbers && <span>01</span>}</div>}
                  </div>
                </div>
              </div>
            </section>
            {panel === "settings" && settingsPanel}
            {panel === "css" && styleLabPanel}
            {panel === "format" && formatPanel}
          </div>
        </div>
      </section>

      <section className="economics shell reveal" id="why">
        <div className="econ-copy">
          <span className="section-kicker">THE TOKEN MATH</span>
          <h2>Spend tokens on thinking,<br/><em>not formatting.</em></h2>
          <p>When an AI generates a DOCX directly, most of the output is invisible formatting instructions. Ask for Markdown instead — the same content in a fraction of the tokens — and let unmarkdown.in handle the document craft.</p>
        </div>
        <div className="econ-chart tilt-card" onMouseMove={tilt} onMouseLeave={untilt} role="img" aria-label="Token cost comparison: direct DOCX generation uses roughly six times more tokens than Markdown">
          <div className="econ-row"><div className="econ-label"><b>AI generates DOCX</b><small>styles, XML, layout instructions</small></div><div className="econ-bar"><i style={{ width: "100%" }}/><span>~6× tokens</span></div></div>
          <div className="econ-row"><div className="econ-label"><b>AI writes Markdown</b><small>pure content, zero overhead</small></div><div className="econ-bar"><i className="econ-md" style={{ width: "17%" }}/><span>1×</span></div></div>
          <p className="econ-note">Same document. unmarkdown.in adds the cover page, Word styles, tables and numbering — for free, in your browser.</p>
        </div>
      </section>

      <section className="templates shell" id="templates">
        <div className="section-title reveal"><span className="section-kicker">PROFESSIONAL STANDARDS</span><h2>Built for real documents.</h2><p>Pick a standard — unmarkdown.in applies its typography, hierarchy, spacing, tables and Word styles, then takes you straight to the studio.</p></div>
        <div className="template-grid reveal">
          {(Object.keys(themes) as ThemeKey[]).map((key, index) => <button key={key} className={`template-card ${themeKey === key ? "selected" : ""}`} onMouseMove={tilt} onMouseLeave={untilt} onClick={() => { applyStandard(key); document.querySelector("#studio")?.scrollIntoView({ behavior: "smooth" }); }}>
            <div className={`mini-page mini-${key}`}><small>UNMARKDOWN / 0{index + 1}</small><h3>{themes[key].sample}</h3><i/><p>{themes[key].category}</p></div>
            <div className="template-meta"><div><b>{themes[key].label}</b><small>{themes[key].description}</small></div><span>{themeKey === key ? "✓" : "→"}</span></div>
          </button>)}
        </div>
      </section>

      <section className="features" id="features"><div className="shell feature-grid reveal"><div><span className="feature-no">01</span><h3>Standards, not skins</h3><p>Legal, SRS, architecture, executive, editorial, academic and technical standards shape preview and export.</p></div><div><span className="feature-no">02</span><h3>Style without limits</h3><p>Eight CSS recipes, live colour and typography controls, plus unrestricted custom CSS for every uploaded file.</p></div><div><span className="feature-no">03</span><h3>Word-native output</h3><p>Real headings, styled tables, numbered lists, code blocks and editable document structure.</p></div></div></section>

      <section className="workflow-links shell" aria-labelledby="workflow-links-title">
        <div><span className="section-kicker">POPULAR WORKFLOWS</span><h2 id="workflow-links-title">Start with the document you need.</h2></div>
        <nav aria-label="Markdown converters and templates">{workflowLinks.map(([label, href]) => <a key={href} href={href}><span>{label}</span><b>→</b></a>)}</nav>
      </section>

      <section className="cta-band">
        <div className="shell cta-inner reveal">
          <div><span className="section-kicker">READY WHEN YOUR AI IS</span><h2>Paste the Markdown.<br/><em>Ship the document.</em></h2></div>
          <button className="primary" onClick={() => fileRef.current?.click()}>Upload a .md file <span>→</span></button>
        </div>
      </section>

      <footer className="shell">
        <a className="brand" href="#top" aria-label="unmarkdown.in home"><span className="brand-mark" aria-hidden="true">M<i>↓</i></span><span className="brand-name">unmarkdown<em>.in</em></span></a>
        <p>Professional documents from one Markdown file.</p>
        <div className="footer-contact">
          <span>Developed by <b>Sainath K</b></span>
          <a href="mailto:aichroniclesmedia@gmail.com">aichroniclesmedia@gmail.com</a>
          <a href="tel:+916309780970">+91 63097 80970</a>
        </div>
      </footer>
      <input ref={fileRef} className="sr-only" type="file" accept=".md,text/markdown,text/plain" onChange={(e) => openFile(e.target.files?.[0])}/>
      <input ref={logoRef} className="sr-only" type="file" accept="image/png,image/jpeg,image/gif,image/bmp" onChange={(e) => { openLogo(e.target.files?.[0]); e.target.value = ""; }}/>
      <style>{`${customCss}\n@media print { @page { size: ${pageSize === "a4" ? "A4" : "Letter"}; margin: ${padding}; } }`}</style>
      {notice && <div className="toast" role="status">{notice}</div>}
    </main>
  );
}
