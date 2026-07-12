# Software Requirements Specification

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
| FR-004 | The system shall support multiple document standards. | Should |

## 4. Non-Functional Requirements

- **NFR-001 — Privacy:** Source files shall not leave the browser.
- **NFR-002 — Usability:** Export shall require no specialist knowledge.
- **NFR-003 — Compatibility:** DOCX output shall open in Microsoft Word.

## 5. Acceptance Criteria

1. Uploading a Markdown file displays its content.
2. Changing a template updates the preview immediately.
3. The exported document preserves the selected professional style.
