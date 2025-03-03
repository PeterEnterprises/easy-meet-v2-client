import { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex bg-muted flex-col justify-between p-10">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">EZ Meet</span>
          </Link>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Find the perfect time to meet</h1>
          <p className="text-muted-foreground">
            EZ Meet helps you schedule meetings across different time zones with ease.
            Create events, invite participants, and find the best time that works for everyone.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EZ Meet. All rights reserved.
        </p>
      </div>
      <div className="flex flex-col justify-center p-4 md:p-10">
        <div className="md:hidden flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">EZ Meet</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
