import { DocsMobileNav } from "@/components/layout/DocsMobileNav";
import { DocsSidebar } from "@/components/layout/DocsSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:gap-12 xl:px-8">
      <div className="lg:hidden">
        <DocsMobileNav />
      </div>
      <DocsSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
