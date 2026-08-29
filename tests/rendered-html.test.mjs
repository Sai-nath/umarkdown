import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the unmarkdown.in Markdown converter", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>unmarkdown\.in — Professional documents from Markdown<\/title>/i);
  assert.match(html, /AI writes Markdown/);
  assert.match(html, /Upload a \.md file/);
  assert.match(html, /DOCUMENT PREVIEW/);
  assert.match(html, /SRS Standard/);
  assert.match(html, /Architecture/);
  assert.match(html, /Legal &amp; Policy/);
  assert.match(html, /Company &amp; document/);
  assert.match(html, /Style Lab/);
  assert.match(html, /Scrollable document preview/);
  assert.match(html, /Zoom out/);
  assert.match(html, /Zoom in/);
  assert.match(html, /↓ PDF/);
  assert.match(html, /Professional DOCX/);
  assert.match(html, /Preview DOCX/);
  assert.match(html, /or drop your Markdown here/);
  assert.match(html, /Start fresh or explore a ready-made document/);
  assert.match(html, /Start writing/);
  assert.match(html, /Explore sample/);
  assert.match(html, /Developed by/);
  assert.match(html, /aichroniclesmedia@gmail\.com/);
  assert.match(html, /\+91 63097 80970/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("keeps long previews on a readable paper canvas", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.page-a4 \{ width: 794px; min-height: 1123px; \}/);
  assert.match(css, /\.page-letter \{ width: 816px; min-height: 1056px; \}/);
  assert.match(css, /\.document-preview \{[^}]*background: var\(--paper\)/);
  assert.match(css, /\.preview-scroll \{[^}]*overflow: auto/);
  assert.match(css, /\.docx-preview-fullscreen \{[^}]*position: fixed/);
  assert.match(css, /\.studio-start \{/);
  assert.doesNotMatch(css, /overscroll-behavior:\s*contain/);
  assert.match(css, /print-color-adjust: exact/);
  assert.match(css, /\.studio, \.shell-wide \{ width: 100%/);
  assert.doesNotMatch(css, /\.seo-nav \{[^}]*position:\s*sticky/);
});

test("renders unique indexable landing pages with FAQs and internal links", async () => {
  const pages = [
    ["/markdown-to-word", "Convert Markdown to Word without rebuilding the formatting"],
    ["/markdown-to-pdf", "Turn Markdown into a polished PDF directly in your browser"],
    ["/markdown-to-docx", "Export Markdown as a professional DOCX with real Word styles"],
    ["/chatgpt-markdown-to-word", "Turn ChatGPT Markdown into Word without spending tokens on formatting"],
    ["/srs-document-generator", "Create a review-ready software requirements specification from Markdown"],
    ["/architecture-document-template", "A practical architecture document template for systems and decisions"],
  ];
  for (const [path, heading] of pages) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, path);
    assert.match(html, new RegExp(heading));
    assert.match(html, new RegExp(`<link rel="canonical" href="https://www\\.unmarkdown\\.in${path}"`));
    assert.match(html, /FAQPage/);
    assert.match(html, /SoftwareApplication/);
    assert.match(html, /studio-premium-background\.jpg/);
    assert.match(html, /Upload Markdown/);
    assert.match(html, /Export DOCX or PDF/);
    assert.match(html, /Explore related Markdown tools and templates/);
  }
});

test("publishes every landing page in the sitemap and exposes the IndexNow key", async () => {
  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  for (const slug of ["markdown-to-word", "markdown-to-pdf", "markdown-to-docx", "chatgpt-markdown-to-word", "srs-document-generator", "architecture-document-template"]) {
    assert.match(xml, new RegExp(`https://www\\.unmarkdown\\.in/${slug}`));
  }
  const key = await render("/api/indexnow");
  assert.equal(key.status, 200);
  assert.match(await key.text(), /^[a-f0-9]{32}$/);
  const indexNowRoute = await readFile(new URL("../app/api/indexnow/route.ts", import.meta.url), "utf8");
  assert.match(indexNowRoute, /\$\{siteUrl\}\/\$\{key\}\.txt/);
  const keyFile = await readFile(new URL("../public/bf1d94f0e625ceac4d1d0b5032ce05cb.txt", import.meta.url), "utf8");
  assert.match(keyFile.trim(), /^[a-f0-9]{32}$/);
});

test("detects legal Markdown and exposes unrestricted styling", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /privacy policy\|terms/);
  assert.match(page, /setThemeKey\("legal"\)/);
  assert.match(page, /Always enabled/);
  assert.match(page, /Object\.keys\(cssPresets\)/);
  assert.match(page, /function cleanMarkdownText/);
  assert.match(page, /headingIsSection/);
  assert.match(page, /boldTitles/);
  assert.match(page, /Company setup/);
  assert.match(page, /Footer text/);
  assert.match(page, /Save company style/);
  assert.match(page, /showFooter/);
  assert.match(page, /flowchart LR/);
  assert.match(page, /renderMermaidSvg/);
  assert.match(page, /file\.size > 5 \* 1024 \* 1024/);
  assert.match(page, /isExporting/);
  assert.match(page, /import\("html2pdf\.js"\)/);
  assert.match(page, /paperRef/);
  assert.match(page, /Building PDF…/);
  assert.match(page, /markdown_upload/);
  assert.match(page, /pdf_export/);
  assert.match(page, /docx_export/);
  assert.match(page, /docx_preview/);
  assert.match(page, /Close DOCX preview/);
  assert.match(page, /\/markdown-to-word/);
  assert.match(page, /OUTPUT CONTRACT/);
  assert.match(page, /MARKDOWN TOOLKIT/);
  assert.match(page, /FINAL QUALITY CHECK/);
  assert.match(page, /fenced `mermaid` block/);
  assert.match(page, /\[TBD: specific information needed\]/);
  assert.match(page, /traceability table/);
  assert.match(page, /ADR table/);
  assert.match(page, /Cite only sources supplied/);
  assert.doesNotMatch(page, /window\.print/);
  assert.doesNotMatch(page, /＋ Upload \.md|↑ Upload \.md/);
  assert.ok(page.indexOf("technical specification") < page.indexOf("/privacy|terms|policy|agreement|legal|cookie/"));
  const presetBlock = page.slice(page.indexOf("const cssPresets"), page.indexOf("type ThemeKey"));
  assert.ok((presetBlock.match(/description:/g) ?? []).length >= 16);
});
