# Document SDK — Developer Guide

**Package:** `@unmarkdown/sdk`
**Version:** 3.2.0

## Quick start

```bash
npm install @unmarkdown/sdk
```

```ts
import { renderDocument } from "@unmarkdown/sdk";

const docx = await renderDocument({
  source: markdown,
  standard: "minimal",
  export: "docx",
});
```

## Usage

The SDK converts Markdown into styled documents without any server round-trip. All rendering happens in-process.

### Applying a standard

```ts
const result = await renderDocument({
  source,
  standard: "srs",          // legal | srs | architecture | executive
  numberedHeadings: true,
});
```

## API reference

| Parameter | Type | Description |
| --- | --- | --- |
| `source` | `string` | Raw Markdown input |
| `standard` | `Standard` | Professional formatting standard |
| `export` | `"pdf" \| "docx"` | Output format |
| `coverPage` | `boolean` | Prepend a generated cover page |
| `toc` | `boolean` | Insert a table of contents |

## Notes

- Input is sanitised before rendering; raw HTML is stripped.
- Exports use native Word styles, so documents stay editable.
- See the changelog for breaking changes between major versions.
