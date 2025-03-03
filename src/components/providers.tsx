"use client";

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/services';
import { AuthProvider } from '@/hooks';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ApolloProvider>
  );
}
