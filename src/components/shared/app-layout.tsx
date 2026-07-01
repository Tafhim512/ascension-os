import { Sidebar } from "@/components/shared/sidebar";
import { MobileNav } from "@/components/shared/mobile-nav";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className="flex h-screen w-full bg-bg-primary text-text-primary overflow-hidden">
        {/* Dynamic Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-blue/10 via-bg-primary to-bg-primary opacity-50"></div>
          <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-accent-purple/10 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent-cyan/5 blur-[100px] rounded-full mix-blend-screen opacity-30"></div>
        </div>

        <div className="z-10 flex w-full h-full">
          <Sidebar />
          <main className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden pb-24 md:pb-0 pt-14 md:pt-0">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </TooltipProvider>
  );
}
