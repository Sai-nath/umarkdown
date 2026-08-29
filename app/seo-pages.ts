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
};

export const siteUrl = "https://www.unmarkdown.in";

export const seoPages: Record<string, SeoPage> = {
  "markdown-to-word": {
    slug: "markdown-to-word",
    title: "Markdown to Word Converter | Free DOCX Export",
    description: "Convert Markdown into a polished, editable Word document with real headings, tables, cover pages and professional styles. Private and browser-based.",
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
  },
  "markdown-to-pdf": {
    slug: "markdown-to-pdf",
    title: "Markdown to PDF Converter | Styled PDF Export",
    description: "Convert Markdown to a clean, professional PDF with accurate A4 or Letter sizing, branded styling, tables and diagrams. No account required.",
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
  },
  "markdown-to-docx": {
    slug: "markdown-to-docx",
    title: "Markdown to DOCX Converter | Professional Word Styles",
    description: "Export Markdown as a professional DOCX with native Word styles, cover pages, tables of contents, numbering, headers and branded footers.",
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
  },
  "chatgpt-markdown-to-word": {
    slug: "chatgpt-markdown-to-word",
    title: "ChatGPT Markdown to Word | Save Tokens, Export DOCX",
    description: "Ask ChatGPT for Markdown, then convert it into a polished Word document. Keep AI focused on content and handle DOCX formatting in the browser.",
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
  },
  "srs-document-generator": {
    slug: "srs-document-generator",
    title: "SRS Document Generator | Markdown to Word and PDF",
    description: "Create a structured software requirements specification from Markdown and export a review-ready SRS as DOCX or PDF with numbered sections.",
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
  },
  "architecture-document-template": {
    slug: "architecture-document-template",
    title: "Architecture Document Template | Markdown, DOCX and PDF",
    description: "Use a practical software architecture document template with Markdown headings, decisions, tables and Mermaid diagrams, then export DOCX or PDF.",
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
  },
};

export const seoPageList = Object.values(seoPages);
