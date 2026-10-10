import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main id="contenu" className="flex-1 pt-16 sm:pt-20 print:pt-0">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
