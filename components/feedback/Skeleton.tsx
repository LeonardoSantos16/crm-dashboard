import type { ReactNode } from "react";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "h-4 w-full" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-sm bg-paper-shade animate-pulse motion-reduce:animate-none ${className}`}
    />
  );
}

type LoadingRegionProps = {
  label?: string;
  className?: string;
  children: ReactNode;
};

export function LoadingRegion({ label = "Carregando…", className = "", children }: LoadingRegionProps) {
  return (
    <div aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
