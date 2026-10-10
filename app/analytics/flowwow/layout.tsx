import { ReactNode } from "react";
import { FlowwowTabs } from "@/components/FlowwowTabs";

export default function FlowwowLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <FlowwowTabs />
      {children}
    </>
  );
}
