import { ReactNode } from "react";
import { MainLayout } from "@/components/layout";

interface MainAppLayoutProps {
  children: ReactNode;
}

export default function MainAppLayout({ children }: MainAppLayoutProps) {
  // Removed the client-side authentication check here since:
  // 1. We already have middleware handling auth redirects
  // 2. The MainLayout component now handles authentication state
  // 3. Having multiple redirects was causing an infinite loop
  
  return <MainLayout>{children}</MainLayout>;
}
