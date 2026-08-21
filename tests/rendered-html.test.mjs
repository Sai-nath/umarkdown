import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
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
  assert.match(css, /\.studio-start \{/);
  assert.doesNotMatch(css, /overscroll-behavior:\s*contain/);
  assert.match(css, /print-color-adjust: exact/);
  assert.match(css, /\.studio, \.shell-wide \{ width: 100%/);
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
  assert.doesNotMatch(page, /window\.print/);
  assert.doesNotMatch(page, /＋ Upload \.md|↑ Upload \.md/);
  assert.ok(page.indexOf("technical specification") < page.indexOf("/privacy|terms|policy|agreement|legal|cookie/"));
  const presetBlock = page.slice(page.indexOf("const cssPresets"), page.indexOf("type ThemeKey"));
  assert.ok((presetBlock.match(/description:/g) ?? []).length >= 16);
});
