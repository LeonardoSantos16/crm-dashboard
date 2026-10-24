import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const SCANNED_DIRS = ["src"];
const EXTENSIONS = [".ts", ".tsx", ".css"];

const ALLOWLIST: string[] = [];

const RAW_COLOR = /(?<![\w&])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b|\b(?:rgba?|hsla?|oklch)\(/gi;

const TAILWIND_PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const OFF_TOKEN_UTILITY = new RegExp(
  `\\b[a-z-]+-(?:${TAILWIND_PALETTE})-(?:50|[1-9]00|950)\\b|\\b(?:bg|text|border|ring|outline|fill|stroke|divide|decoration|accent|caret|from|via|to)-black\\b`,
  "g",
);

function listFiles(dir: string): string[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(path);
    return EXTENSIONS.some((ext) => entry.name.endsWith(ext)) ? [path] : [];
  });
}

function stripThemeBlocks(css: string): string {
  let result = "";
  let index = 0;
  for (const match of css.matchAll(/@theme\b[^{]*\{/g)) {
    if (match.index < index) continue;
    let depth = 1;
    let end = match.index + match[0].length;
    while (end < css.length && depth > 0) {
      if (css[end] === "{") depth++;
      if (css[end] === "}") depth--;
      end++;
    }
    result += css.slice(index, match.index) + css.slice(match.index, end).replace(/[^\n]/g, " ");
    index = end;
  }
  return result + css.slice(index);
}

function findViolations(pattern: RegExp) {
  const violations: string[] = [];
  const files = SCANNED_DIRS.flatMap((dir) => listFiles(join(ROOT, dir)));
  for (const file of files) {
    const path = relative(ROOT, file).replaceAll("\\", "/");
    if (ALLOWLIST.includes(path)) continue;
    const source = readFileSync(file, "utf8");
    const text = path.endsWith(".css") ? stripThemeBlocks(source) : source;
    text.split("\n").forEach((line, i) => {
      for (const match of line.matchAll(pattern)) {
        violations.push(`${path}:${i + 1} ${match[0]}`);
      }
    });
  }
  return violations;
}

describe("design tokens are the only source of color", () => {
  it("has no hex, rgb, hsl, or oklch literals outside @theme", () => {
    expect(findViolations(RAW_COLOR)).toEqual([]);
  });

  it("has no default Tailwind palette utilities", () => {
    expect(findViolations(OFF_TOKEN_UTILITY)).toEqual([]);
  });
});
