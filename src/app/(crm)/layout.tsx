import { TopBar } from "./_components/TopBar";

export default function CrmLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <TopBar />
      <main className="flex flex-1 flex-col">{children}</main>
    </>
  );
}
