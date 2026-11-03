import type { ReactNode } from "react";
import { RouteGuard } from "@/components/RouteGuard";
import { BottomNav } from "@/components/space/BottomNav";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col bg-[#f2f5fa] md:my-6 md:min-h-[calc(100dvh-3rem)] md:max-h-[calc(100dvh-3rem)] md:overflow-hidden md:rounded-[2rem] md:shadow-2xl md:shadow-slate-900/15 md:ring-1 md:ring-black/5">
        <div className="flex-1 overflow-y-auto">{children}</div>
        <BottomNav />
      </div>
    </RouteGuard>
  );
}
