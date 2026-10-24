type PlaceholderProps = {
  title: string;
  message: string;
};

export function Placeholder({ title, message }: PlaceholderProps) {
  return (
    <section className="flex flex-col gap-2 p-6">
      <h1 className="display-title">{title}</h1>
      <p className="text-sm text-ink-soft">{message}</p>
    </section>
  );
}
