import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { pickAlertState, StatusBadge, type StatusState } from "./StatusBadge";

afterEach(cleanup);

const labels: [StatusState, string][] = [
  ["attention", "Atenção"],
  ["error", "Erro"],
  ["success", "Fechada"],
  ["lost", "Perdida"],
  ["snoozed", "Adiada"],
  ["escalated", "Escalonada"],
];

describe("StatusBadge", () => {
  it.each(labels)("renders %s with the label %s and a hidden icon", (state, label) => {
    render(<StatusBadge state={state} />);
    const badge = screen.getByText(label).closest("span[data-state]");
    expect(badge?.getAttribute("data-state")).toBe(state);
    const icon = badge?.querySelector("svg");
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });

  it("uses the label override", () => {
    render(<StatusBadge state="snoozed" label="Adiada até 25/10" />);
    expect(screen.getByText("Adiada até 25/10")).toBeTruthy();
    expect(screen.queryByText("Adiada")).toBeNull();
  });
});

describe("pickAlertState", () => {
  it("puts escalated above attention above snoozed", () => {
    expect(pickAlertState(["snoozed", "attention", "escalated"])).toBe("escalated");
    expect(pickAlertState(["snoozed", "attention"])).toBe("attention");
    expect(pickAlertState(["snoozed"])).toBe("snoozed");
  });

  it("returns undefined when no alert state applies", () => {
    expect(pickAlertState([])).toBeUndefined();
  });
});
