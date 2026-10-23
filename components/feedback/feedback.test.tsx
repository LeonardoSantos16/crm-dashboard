import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingRegion, Skeleton } from "./Skeleton";

afterEach(cleanup);

describe("ErrorState", () => {
  it("is announced as an alert and calls onRetry from Tentar novamente", () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Não foi possível carregar as oportunidades." onRetry={onRetry} />);

    const alert = screen.getByRole("alert");
    expect(alert.textContent).toContain("Não foi possível carregar as oportunidades.");

    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe("EmptyState", () => {
  it("renders its message without an action by default", () => {
    render(<EmptyState message="Nenhuma oportunidade nesta etapa." />);
    expect(screen.getByText("Nenhuma oportunidade nesta etapa.")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders the optional action", () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        message="Nenhuma oportunidade com esses filtros."
        action={{ label: "Limpar filtros", onClick }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("LoadingRegion", () => {
  it("exposes aria-busy and the hidden Carregando… text", () => {
    const { container } = render(
      <LoadingRegion>
        <Skeleton className="h-20" />
      </LoadingRegion>,
    );
    const region = container.querySelector("[aria-busy]");
    expect(region?.getAttribute("aria-busy")).toBe("true");
    const message = screen.getByText("Carregando…");
    expect(message.className).toContain("sr-only");
  });

  it("uses a specific loading message", () => {
    render(
      <LoadingRegion label="Carregando oportunidades">
        <Skeleton />
      </LoadingRegion>,
    );
    expect(screen.getByText("Carregando oportunidades")).toBeTruthy();
  });

  it("hides skeleton blocks from assistive technology and stops the pulse on reduced motion", () => {
    const { container } = render(<Skeleton className="h-4 w-24" />);
    const block = container.firstElementChild;
    expect(block?.getAttribute("aria-hidden")).toBe("true");
    expect(block?.className).toContain("animate-pulse");
    expect(block?.className).toContain("motion-reduce:animate-none");
  });
});
