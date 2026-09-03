import { buildDocumentPrompt } from "./document-prompts";

export type SeoPage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lede: string;
  problemHeading: string;
  problem: string;
  benefits: Array<{ title: string; text: string }>;
  steps: Array<{ title: string; text: string }>;
  faq: Array<{ question: string; answer: string }>;
  sample: "legal" | "srs" | "architecture" | "executive" | "editorial" | "academic" | "minimal";
  example: { title: string; intro: string; markdown: string };
  prompt?: { label: string; heading: string; intro: string; text: string };
};

export const siteUrl = "https://www.unmarkdown.in";

export const seoPages: Record<string, SeoPage> = {
  "markdown-to-word": {
    slug: "markdown-to-word",
    title: "Markdown to Word Converter Online (Free DOCX) | Unmarkdown",
    description: "Convert Markdown to an editable Word document online. Preview headings, tables and branding, then export a professional DOCX privately in your browser.",
    eyebrow: "MARKDOWN TO WORD",
    h1: "Convert Markdown to Word without rebuilding the formatting",
    lede: "Bring a Markdown report, proposal or specification and leave with an editable Word document that is ready to review, brand and share.",
    problemHeading: "Markdown is efficient. Word is expected.",
    problem: "Markdown keeps writing fast and structured, but most clients and teams still expect a .docx file. Copying content into Word by hand means repairing every heading, list, table and page break. Unmarkdown turns the same source into a professionally styled document while preserving the structure you already wrote.",
    benefits: [
      { title: "Editable Word output", text: "Export a true DOCX with native headings, lists, tables and document properties." },
      { title: "Professional structure", text: "Add a cover, table of contents, numbered sections, headers, footers and page numbers." },
      { title: "Private conversion", text: "Your Markdown is processed in the browser and does not need to be uploaded to a server." },
    ],
    steps: [
      { title: "Choose your Markdown", text: "Select a .md file or start writing directly in the document studio." },
      { title: "Set the document style", text: "Choose a professional standard, add company details and check the live preview." },
      { title: "Download Word", text: "Export an editable DOCX that opens in Microsoft Word and compatible editors." },
    ],
    faq: [
      { question: "Can I edit the Word file after conversion?", answer: "Yes. The exported DOCX uses native Word paragraphs, headings, lists and tables, so the document remains editable." },
      { question: "Does the converter support Markdown tables?", answer: "Yes. Markdown tables are converted into styled Word tables and are also shown in the live preview." },
      { question: "Can I add my company logo?", answer: "Yes. You can add a logo, brand colour, company name and footer text before exporting the document." },
      { question: "Is my Markdown uploaded to a server?", answer: "No. Conversion and preview generation happen in your browser." },
    ],
    sample: "executive",
    example: {
      title: "See how Markdown becomes an editable Word document",
      intro: "Start with a short report containing headings, a summary and a table. Unmarkdown preserves that structure as native Word content you can continue editing.",
      markdown: "# Quarterly Operations Report\n\n## Executive Summary\nDelivery time improved while customer satisfaction remained stable.\n\n## Key Results\n\n| Metric | Result | Change |\n| --- | ---: | ---: |\n| On-time delivery | 96% | +4% |\n| Customer satisfaction | 4.7/5 | +0.2 |",
    },
    prompt: {
      label: "WORD DOCUMENT AI PROMPT",
      heading: "Ask your AI for Word-ready Markdown",
      intro: "Use this prompt to get clean source content first. Then preview, brand and export it as an editable Word document in Unmarkdown.",
      text: buildDocumentPrompt("executive"),
    },
  },
  "markdown-to-pdf": {
    slug: "markdown-to-pdf",
    title: "Markdown to PDF Converter Online (Free) | Unmarkdown",
    description: "Convert Markdown to a polished PDF online with live preview, A4 or Letter pages, tables, diagrams and branding. Free, private and browser-based.",
    eyebrow: "MARKDOWN TO PDF",
    h1: "Turn Markdown into a polished PDF directly in your browser",
    lede: "Create a presentation-ready PDF from Markdown with consistent typography, real page dimensions and a preview that shows the final visual direction before export.",
    problemHeading: "A PDF should look intentional, not merely printed.",
    problem: "Basic Markdown-to-PDF tools often produce plain pages with generic fonts, awkward spacing and broken tables. Unmarkdown gives the document a professional standard first, then exports the styled preview directly to PDF without sending the source to a backend.",
    benefits: [
      { title: "Preview before export", text: "Check headings, tables, diagrams, spacing and brand details before generating the PDF." },
      { title: "A4 and Letter layouts", text: "Use accurate page dimensions with narrow, professional or wide document margins." },
      { title: "Direct PDF download", text: "Generate the PDF inside the app without opening the browser print interface." },
    ],
    steps: [
      { title: "Load the Markdown", text: "Drop in a .md file or edit the included sample document." },
      { title: "Review the preview", text: "Apply a standard, adjust typography and confirm the page setup." },
      { title: "Export PDF", text: "Download the styled PDF directly from the document studio." },
    ],
    faq: [
      { question: "Will the PDF match the preview?", answer: "The PDF is generated from the styled document preview using the selected page size, margins, colours and typography." },
      { question: "Can I export Mermaid diagrams?", answer: "Yes. Mermaid flowcharts can be rendered in the preview and included in the exported document." },
      { question: "Do I need to install software?", answer: "No. The converter runs in a modern browser and downloads the finished PDF." },
      { question: "Can I use a custom page style?", answer: "Yes. Use the built-in recipes, style controls or custom CSS before exporting." },
    ],
    sample: "editorial",
    example: {
      title: "Preview a styled Markdown PDF before exporting",
      intro: "Use headings, quotes, lists and tables in the source. The document studio shows the selected page size and visual style before you download the PDF.",
      markdown: "# Product Launch Brief\n\n> A focused launch plan for the next release.\n\n## Objectives\n\n- Introduce the new workflow\n- Give customers a clear migration path\n- Measure activation during the first 30 days\n\n## Launch Schedule\n\n| Phase | Owner | Status |\n| --- | --- | --- |\n| Preview | Product | Ready |\n| Release | Engineering | Planned |",
    },
    prompt: {
      label: "PDF DOCUMENT AI PROMPT",
      heading: "Generate clean Markdown for a polished PDF",
      intro: "Ask your AI assistant for structured content without layout instructions. Unmarkdown handles page size, typography, branding and PDF export.",
      text: buildDocumentPrompt("editorial"),
    },
  },
  "markdown-to-docx": {
    slug: "markdown-to-docx",
    title: "Markdown to DOCX Converter Online | Unmarkdown",
    description: "Export Markdown to DOCX with native Word headings, editable tables, cover pages, table of contents, numbering, headers and branded footers.",
    eyebrow: "MARKDOWN TO DOCX",
    h1: "Export Markdown as a professional DOCX with real Word styles",
    lede: "Move from a lightweight Markdown source to a structured DOCX that behaves like a document created carefully in Word, not a block of pasted text.",
    problemHeading: "A useful DOCX needs more than converted text.",
    problem: "A raw conversion can preserve words while losing the document system around them. Reviewers need navigable headings, editable tables, consistent numbering and dependable page furniture. Unmarkdown maps Markdown structure to native Word elements and applies the selected professional standard during export.",
    benefits: [
      { title: "Native heading styles", text: "Create Word headings that support navigation and an automatic table of contents." },
      { title: "Document controls", text: "Configure cover pages, section numbering, headers, footers, classification and version details." },
      { title: "Brand-ready output", text: "Carry your company logo, accent colour and footer language into the DOCX." },
    ],
    steps: [
      { title: "Prepare structured Markdown", text: "Use headings, lists, tables, blockquotes and code blocks as the document source." },
      { title: "Choose a standard", text: "Apply SRS, architecture, executive, legal, academic or another professional format." },
      { title: "Generate DOCX", text: "Download a Word-native file for editing, review and controlled distribution." },
    ],
    faq: [
      { question: "Is DOCX different from a Word file?", answer: "DOCX is the current Microsoft Word document format and opens in Word and many compatible editors." },
      { question: "Does the DOCX include a table of contents?", answer: "It can. Enable the table of contents in the document settings before export." },
      { question: "Are headings numbered automatically?", answer: "Yes. Numbered section headings can be enabled or disabled in the document settings." },
      { question: "Can code blocks and tables be exported?", answer: "Yes. They are converted into styled document elements rather than flattened screenshots." },
    ],
    sample: "minimal",
    example: {
      title: "Create a DOCX with native Word structure",
      intro: "Markdown headings become Word headings, tables stay editable, and the selected document settings add professional page furniture.",
      markdown: "# Technical Implementation Note\n\n## Purpose\nDocument the agreed implementation and review criteria.\n\n## Decision\nUse a browser-based conversion workflow so source files remain local.\n\n## Verification\n\n1. Confirm heading navigation in Word.\n2. Edit a table cell.\n3. Refresh the table of contents.\n4. Review headers, footers and page numbers.",
    },
    prompt: {
      label: "DOCX AI PROMPT",
      heading: "Create Markdown that maps cleanly to Word styles",
      intro: "This prompt requests a stable hierarchy, editable tables and document metadata that convert cleanly into a native DOCX.",
      text: buildDocumentPrompt("minimal"),
    },
  },
  "chatgpt-markdown-to-word": {
    slug: "chatgpt-markdown-to-word",
    title: "Convert ChatGPT Markdown to Word | Unmarkdown",
    description: "Turn a ChatGPT Markdown response into a polished Word document. Keep AI focused on content, then preview and export an editable DOCX privately.",
    eyebrow: "CHATGPT TO WORD",
    h1: "Turn ChatGPT Markdown into Word without spending tokens on formatting",
    lede: "Let ChatGPT focus on the report, specification or policy itself. Bring its structured Markdown to Unmarkdown and generate the professional Word file separately.",
    problemHeading: "Use AI for thinking, not document plumbing.",
    problem: "When an AI model is asked to build a Word file, part of the response budget goes into formatting instructions and file-generation work. Markdown is compact, predictable and easy for models to produce. Asking for clean Markdown keeps the conversation focused on content, while Unmarkdown handles the cover, styles, numbering and final DOCX.",
    benefits: [
      { title: "Cleaner AI workflow", text: "Request one structured Markdown response instead of iterating on invisible Word formatting." },
      { title: "Reusable source", text: "Keep the Markdown as a version-friendly source for future edits and exports." },
      { title: "Professional delivery", text: "Convert the result into a branded DOCX or PDF when the content is ready." },
    ],
    steps: [
      { title: "Ask for Markdown", text: "Tell ChatGPT to return the complete document as clean Markdown with no surrounding code fence." },
      { title: "Bring it to Unmarkdown", text: "Save the response as .md, upload it and choose the right document standard." },
      { title: "Export for review", text: "Download DOCX for editing or PDF for controlled sharing." },
    ],
    faq: [
      { question: "What should I ask ChatGPT to produce?", answer: "Ask for a complete, well-structured Markdown document with headings, lists and tables where useful, and no code fence around the response." },
      { question: "Why not ask ChatGPT for DOCX directly?", answer: "Markdown keeps the model response focused on visible content and gives you a clean source that can be restyled and exported repeatedly." },
      { question: "Does this work with Claude or Gemini?", answer: "Yes. Any AI assistant that can return Markdown can be used with this workflow." },
      { question: "Can I change the style after uploading?", answer: "Yes. The same Markdown can be previewed and exported using different professional standards." },
    ],
    sample: "executive",
    example: {
      title: "Move from a ChatGPT answer to a professional Word file",
      intro: "Ask for visible Markdown content instead of invisible document formatting, review the source, and export it using a professional standard.",
      markdown: "# AI Adoption Proposal\n\n## Executive Summary\nThis proposal identifies a controlled path for adopting AI-assisted documentation.\n\n## Recommended Approach\n\n1. Start with low-risk internal workflows.\n2. Define review and approval ownership.\n3. Measure quality, time saved and correction rates.\n\n## Decision Required\nApprove a four-week pilot with named owners and success criteria.",
    },
    prompt: {
      label: "CHATGPT TO WORD PROMPT",
      heading: "Get a complete Markdown document from ChatGPT",
      intro: "Paste this prompt into ChatGPT with your topic and source material, then bring the Markdown response to Unmarkdown for Word formatting.",
      text: buildDocumentPrompt("executive"),
    },
  },
  "srs-document-generator": {
    slug: "srs-document-generator",
    title: "Free SRS Document Generator and Template | Unmarkdown",
    description: "Create a structured software requirements specification from Markdown. Use an SRS template, preview numbered requirements, then export DOCX or PDF.",
    eyebrow: "SRS DOCUMENT GENERATOR",
    h1: "Create a review-ready software requirements specification from Markdown",
    lede: "Draft requirements in a format that is easy for humans and AI tools to produce, then apply a structured SRS standard for review, approval and delivery.",
    problemHeading: "Requirements need structure that survives review.",
    problem: "An SRS is more than a long list of features. It needs a stable hierarchy, requirement identifiers, priorities, acceptance criteria and a document format that reviewers can navigate. Unmarkdown provides an SRS-focused sample and professional styling while keeping Markdown as the editable source.",
    benefits: [
      { title: "Numbered hierarchy", text: "Organize scope, functional requirements, non-functional requirements and acceptance criteria consistently." },
      { title: "Audit-friendly tables", text: "Present requirement IDs, descriptions, priorities and status in readable tables." },
      { title: "DOCX and PDF delivery", text: "Export an editable review document or a stable distribution copy from the same source." },
    ],
    steps: [
      { title: "Start with the SRS sample", text: "Use the included structure or upload an existing requirements document in Markdown." },
      { title: "Complete the document", text: "Add scope, actors, interfaces, requirements, constraints and acceptance criteria." },
      { title: "Apply and export", text: "Confirm the SRS standard, company details and page setup, then export DOCX or PDF." },
    ],
    faq: [
      { question: "What sections should an SRS include?", answer: "Common sections include purpose, scope, system overview, interfaces, functional requirements, non-functional requirements, constraints and acceptance criteria." },
      { question: "Can requirements be maintained in tables?", answer: "Yes. Markdown tables work well for requirement IDs, descriptions, priorities, owners and verification status." },
      { question: "Can I use an AI assistant to draft the SRS?", answer: "Yes. Ask the assistant for a complete SRS in Markdown, review the content, then format and export it with Unmarkdown." },
      { question: "Is the generated SRS editable in Word?", answer: "Yes. The DOCX export uses editable native Word elements." },
    ],
    sample: "srs",
    example: {
      title: "Start with a testable SRS Markdown structure",
      intro: "Use stable requirement IDs and explicit verification methods so reviewers can trace each requirement from intent to acceptance test.",
      markdown: "# Software Requirements Specification\n\n## 1. Purpose\nDefine the requirements for the document conversion workflow.\n\n## 2. Functional Requirements\n\n| ID | Requirement | Priority | Verification |\n| --- | --- | --- | --- |\n| FR-001 | The system shall preview Markdown before export. | Must | Test |\n| FR-002 | The system shall export editable DOCX files. | Must | Test |\n\n## 3. Acceptance Criteria\nEach requirement passes its documented verification method.",
    },
    prompt: {
      label: "SRS AI PROMPT",
      heading: "Turn project notes into a complete, testable SRS",
      intro: "Paste this prompt into ChatGPT, Claude, Gemini or another AI assistant with your project context. It requests clean Markdown that is ready for review and professional export.",
      text: buildDocumentPrompt("srs"),
    },
  },
  "architecture-document-template": {
    slug: "architecture-document-template",
    title: "Software Architecture Document Template | Unmarkdown",
    description: "Use a practical software architecture document template with Markdown, ADRs and Mermaid diagrams. Preview it, then export a polished DOCX or PDF.",
    eyebrow: "ARCHITECTURE TEMPLATE",
    h1: "A practical architecture document template for systems and decisions",
    lede: "Document context, components, data flows, quality attributes, deployment and architecture decisions in Markdown, with diagram support and professional export.",
    problemHeading: "Architecture knowledge should not live only in diagrams.",
    problem: "A useful architecture document connects diagrams to constraints, responsibilities, interfaces, risks and decisions. Markdown keeps that record close to engineering work, while Unmarkdown provides a clear technical layout and exports a version suitable for stakeholders outside the repository.",
    benefits: [
      { title: "Diagram-friendly source", text: "Add Mermaid flowcharts alongside the text that explains components and data movement." },
      { title: "Decision traceability", text: "Capture assumptions, alternatives, trade-offs and architecture decisions in a stable hierarchy." },
      { title: "Stakeholder-ready output", text: "Export the same technical source as a polished DOCX or PDF for wider review." },
    ],
    steps: [
      { title: "Describe the context", text: "Define goals, users, external systems, constraints and important quality attributes." },
      { title: "Explain the architecture", text: "Document components, interfaces, data, deployment, security, observability and decisions." },
      { title: "Review and publish", text: "Use the architecture standard, check diagrams in the preview and export the approved format." },
    ],
    faq: [
      { question: "What belongs in a software architecture document?", answer: "Include context, drivers, constraints, component responsibilities, interfaces, data flows, deployment, security, operations, risks and key decisions." },
      { question: "Does the template support Mermaid diagrams?", answer: "Yes. Add Mermaid code blocks to the Markdown and render flowcharts in the document preview." },
      { question: "Can the architecture document use company branding?", answer: "Yes. Add a logo, brand colour, organization name and footer before export." },
      { question: "Can I export the template to Word?", answer: "Yes. Export DOCX for collaborative editing or PDF for a stable review copy." },
    ],
    sample: "architecture",
    example: {
      title: "Document architecture context, flow and decisions together",
      intro: "Keep a diagram beside the constraints and decisions that explain it. Mermaid remains editable in Markdown and renders in the document preview.",
      markdown: "# Software Architecture Document\n\n## 1. System Context\nThe browser application converts local Markdown into professional documents.\n\n```mermaid\nflowchart LR\n  User --> Browser\n  Browser --> Preview\n  Preview --> DOCX\n  Preview --> PDF\n```\n\n## 2. Architecture Decisions\n\n| ID | Decision | Status | Rationale |\n| --- | --- | --- | --- |\n| ADR-001 | Process source files in the browser | Accepted | Preserve privacy |",
    },
    prompt: {
      label: "ARCHITECTURE AI PROMPT",
      heading: "Create an architecture document that explains the decisions",
      intro: "Give your AI assistant the system context, constraints and known decisions with this prompt. The result stays technical, traceable and ready for diagrams, DOCX or PDF.",
      text: buildDocumentPrompt("architecture"),
    },
  },
};

export const seoPageList = Object.values(seoPages);
