import { describe, expect, it } from "vitest";
import { contrastPairs, contrastRatio, readColorTokens } from "./contrast";

const tokens = readColorTokens();

describe("contrastRatio", () => {
  it("matches the WCAG reference values", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
  });
});

describe("declared color pairs", () => {
  it.each(contrastPairs)("$fg on $bg is at least $min:1", ({ fg, bg, min }) => {
    expect(tokens[fg], `--color-${fg} is not defined`).toBeDefined();
    expect(tokens[bg], `--color-${bg} is not defined`).toBeDefined();
    expect(contrastRatio(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(min);
  });
});
