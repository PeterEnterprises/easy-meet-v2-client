"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { login as loginService, signup as signupService, logout as logoutService, refreshToken as refreshTokenService, isAuthenticated, getCurrentUser } from '@/services';
import { LoginVariables, SignupVariables, RefreshTokenVariables } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (variables: LoginVariables) => Promise<void>;
  signup: (variables: SignupVariables) => Promise<void>;
  logout: () => void;
  refreshToken: (variables: RefreshTokenVariables) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      try {
        setLoading(true);
        const isAuth = isAuthenticated();
        setAuthenticated(isAuth);

        if (isAuth) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Authentication check error:', err);
        setError('Failed to authenticate');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (variables: LoginVariables) => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginService(variables);
      setUser(response.user);
      setAuthenticated(true);
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials and try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (variables: SignupVariables) => {
    try {
      setLoading(true);
      setError(null);
      const response = await signupService(variables);
      setUser(response.user);
      setAuthenticated(true);
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      logoutService();
      setUser(null);
      setAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed');
    }
  };

  const refreshTokenFn = async (variables: RefreshTokenVariables) => {
    try {
      setLoading(true);
      setError(null);
      const response = await refreshTokenService(variables);
      setUser(response.user);
      setAuthenticated(true);
    } catch (err) {
      console.error('Token refresh error:', err);
      setError('Failed to refresh authentication');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: authenticated,
    login,
    signup,
    logout,
    refreshToken: refreshTokenFn,
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
