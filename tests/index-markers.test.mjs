import assert from "node:assert/strict";
import test from "node:test";
import { extractIndexTerms, stripIndexMarkers } from "../app/index-markers.ts";

test("extracts, sorts and hides Word index markers", () => {
  const markdown = "Security[[index: Security]] uses AES[[index: Encryption: AES]]. Security[[index: security]].";
  assert.equal(stripIndexMarkers(markdown), "Security uses AES. Security.");
  assert.deepEqual(extractIndexTerms(markdown), ["Encryption: AES", "Security"]);
});
