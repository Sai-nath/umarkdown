export type DocumentPromptKey = "legal" | "srs" | "architecture" | "executive" | "editorial" | "academic" | "minimal";

const promptCore = [
  "Using only the source material and requirements I provide, create the complete document as raw GitHub-Flavored Markdown (.md). Do not generate, attach, or encode a DOCX/PDF; use the response budget for accurate, useful content.",
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

const promptShapes: Record<DocumentPromptKey, string> = {
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

const promptEnd = [
  "",
  "FINAL QUALITY CHECK",
  "- Verify heading order, table column counts, list indentation, code-fence pairing, requirement/decision IDs, and internal consistency.",
  "- Remove empty sections and generic filler. Preserve `[TBD: ...]` markers instead of guessing.",
  "- End with the final document content, ready to save directly as a `.md` file and convert in unmarkdown.in.",
].join("\n");

export function buildDocumentPrompt(key: DocumentPromptKey) {
  return `${promptCore}\n\nDOCUMENT STANDARD\n${promptShapes[key]}\n${promptEnd}`;
}
