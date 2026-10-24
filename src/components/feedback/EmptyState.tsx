type EmptyStateProps = {
  message: string;
  action?: { label: string; onClick: () => void };
};

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-6 text-center text-sm text-ink-soft">
      <p>{message}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex h-11 items-center justify-center rounded-sm border border-border-strong bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-paper-shade active:translate-y-px md:h-9"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
