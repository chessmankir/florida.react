import { ReactNode, Suspense } from "react";
import { FlowwowTabs } from "@/components/FlowwowTabs";

export default function FlowwowLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="mx-auto mb-6 h-14 max-w-[1500px] animate-pulse border-b border-slate-200" />}>
        <FlowwowTabs />
      </Suspense>
      {children}
    </>
  );
}
