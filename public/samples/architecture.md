# System Architecture Document

**System:** Document Publishing Platform
**Version:** 2.1
**Status:** Approved

## 1. Overview

The platform converts Markdown into professionally formatted documents entirely in the browser. It is composed of three cooperating layers: the editor, the rendering pipeline and the export engine.

## 2. Goals & Constraints

- **Privacy first:** no document content may leave the client.
- **Zero install:** the full pipeline must run in a standard browser.
- **Fidelity:** exported DOCX must use native Word styles, not embedded images.

## 3. Components

### 3.1 Rendering Pipeline

The Markdown source is tokenised, sanitised and rendered to a paged preview. Every keystroke re-renders through a deferred queue so typing never blocks.

### 3.2 Export Engine

```ts
interface ExportEngine {
  toPdf(document: RenderedDocument): Promise<Blob>;
  toDocx(tokens: Token[], theme: Theme): Promise<Blob>;
}
```

## 4. Data Flow

1. User uploads or types Markdown in the editor pane.
2. The tokeniser produces a sanitised AST.
3. The theme engine applies the selected professional standard.
4. The export engine serialises the styled AST to PDF or DOCX.

## 5. Key Decisions

| Decision | Rationale | Trade-offs |
| --- | --- | --- |
| Client-side only | Privacy, zero hosting cost | Limited to browser APIs |
| Native Word styles | Editable output | More complex mapping |
| Deferred rendering | Smooth typing | Preview lags ~1 frame |

> All architectural changes require a written decision record reviewed by the platform team.
