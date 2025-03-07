"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { getCurrentUser } from '@/app/actions/auth.action';
import { resetApolloStore } from '@/services/apollo-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Function to fetch the current user
  const refreshUser = async () => {
    try {
      console.log('Refreshing user data...');
      setLoading(true);
      setError(null);
      
      // Try to get the current user, but don't throw an error if not authenticated
      try {
        const currentUser = await getCurrentUser();
        console.log('Current user data:', currentUser ? 'User found' : 'No user found');
        
        if (currentUser) {
          setUser(currentUser);
          setAuthenticated(true);
          console.log('User authenticated, state updated');
          return;
        }
      } catch (err) {
        // Silently handle authentication errors
        if (err instanceof Error && err.message.includes('Authentication required')) {
          console.log('User not authenticated');
        } else {
          console.error('Error fetching user:', err);
        }
      }
      
      // If we get here, either there's no user or there was an error
      console.log('Setting user to null and authenticated to false');
      setUser(null);
      setAuthenticated(false);
    } catch (err) {
      console.error('Error refreshing user:', err);
      setError('Failed to refresh user data');
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
      console.log('Auth loading state set to false');
    }
  };

  // Check if user is authenticated on mount only, but skip on auth pages
  useEffect(() => {
    // Skip refreshing user data on auth pages to prevent authentication errors
    const isAuthPage = typeof window !== 'undefined' && 
      (window.location.pathname.includes('/login') || 
       window.location.pathname.includes('/signup'));
    
    if (!isAuthPage) {
      console.log('AuthProvider mounted on non-auth page, refreshing user');
      refreshUser();
    } else {
      console.log('AuthProvider mounted on auth page, skipping user refresh');
      // Just set loading to false without trying to fetch user data
      setLoading(false);
    }
  }, []);

  // Logout function - reset Apollo store and redirect to logout API
  const logout = async () => {
    // Reset Apollo store to clear any cached data
    await resetApolloStore();
    
    // Clear local state
    setUser(null);
    setAuthenticated(false);
    
    // Redirect to logout API route
    router.push('/api/auth/logout');
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: authenticated,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
