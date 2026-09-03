const indexMarker = /\[\[index:\s*([^\]\r\n]+?)\s*\]\]/gi;

export function stripIndexMarkers(value: string) {
  return value.replace(indexMarker, "");
}

export function extractIndexTerms(value: string) {
  const unique = new Map<string, string>();
  for (const match of value.matchAll(indexMarker)) {
    const term = match[1].trim();
    if (term && !unique.has(term.toLocaleLowerCase())) unique.set(term.toLocaleLowerCase(), term);
  }
  return [...unique.values()].sort((a, b) => a.localeCompare(b));
}
