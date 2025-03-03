"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks";
import { Header } from "./header";
import { Footer } from "./footer";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { loading, refreshUser } = useAuth();
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const hasRefreshedRef = useRef(false);

  // Ensure authentication state is loaded before rendering layout
  useEffect(() => {
    console.log('MainLayout mounted, auth loading state:', loading);
    
    if (!loading) {
      console.log('Auth loading complete, setting layout as ready');
      setIsLayoutReady(true);
    }
  }, [loading]);

  // Refresh user data when layout mounts, but only once
  useEffect(() => {
    if (!hasRefreshedRef.current) {
      console.log('MainLayout mounted, refreshing user data (first time only)');
      refreshUser();
      hasRefreshedRef.current = true;
    }
  }, [refreshUser]);

  // Show minimal loading state while auth is being checked
  if (loading || !isLayoutReady) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow px-15">{children}</main>
      <Footer />
    </div>
  );
}
