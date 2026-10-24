import { readFileSync } from "node:fs";
import { join } from "node:path";

export type ContrastPair = {
  fg: string;
  bg: string;
  min: 4.5 | 3;
};

const TEXT = 4.5;
const NON_TEXT = 3;

function pairs(fg: string, bgs: string[], min: ContrastPair["min"]) {
  return bgs.map((bg) => ({ fg, bg, min }));
}

export const contrastPairs: ContrastPair[] = [
  ...pairs("ink", ["paper", "surface", "paper-shade"], TEXT),
  ...pairs("ink-soft", ["paper", "surface", "paper-shade", "moss"], TEXT),
  ...pairs("white", ["forest"], TEXT),
  ...pairs("forest", ["surface", "paper"], TEXT),
  ...pairs("forest-deep", ["moss"], TEXT),
  ...pairs("moss", ["forest-deep"], TEXT),
  ...pairs("crown", ["forest-deep"], TEXT),
  ...pairs("attention-fg", ["attention-bg", "surface"], TEXT),
  ...pairs("error-fg", ["error-bg", "surface", "paper"], TEXT),
  ...pairs("white", ["error-solid"], TEXT),
  ...pairs("success-fg", ["success-bg"], TEXT),
  ...pairs("lost-fg", ["lost-bg", "surface"], TEXT),
  ...pairs("snoozed-fg", ["snoozed-bg", "surface"], TEXT),
  ...pairs("escalated-fg", ["escalated-bg", "surface"], TEXT),
  ...["attention", "success", "lost", "snoozed", "escalated"].flatMap((state) =>
    pairs(`${state}-solid`, ["surface"], NON_TEXT),
  ),
  ...pairs("attention-solid", ["attention-bg"], NON_TEXT),
  ...pairs("lost-solid", ["lost-bg"], NON_TEXT),
  ...pairs("border-strong", ["surface", "paper"], NON_TEXT),
];

export function parseColorTokens(css: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const match of css.matchAll(/--color-([a-z0-9-]+)\s*:\s*(#[0-9a-f]{6})\b/gi)) {
    tokens[match[1]] = match[2].toUpperCase();
  }
  return tokens;
}

export function readColorTokens(): Record<string, string> {
  return parseColorTokens(readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8"));
}

function channel(value: number) {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const r = channel((n >> 16) & 0xff);
  const g = channel((n >> 8) & 0xff);
  const b = channel(n & 0xff);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
