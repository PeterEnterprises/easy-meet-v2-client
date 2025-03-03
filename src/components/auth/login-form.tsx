"use client";

import { useEffect } from "react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/app/actions/auth.action";

// For debugging
console.log('Login form component loaded');

// Initial state for form
const initialState = {
  error: null,
  fieldErrors: {
    usernameOrEmail: [],
    password: [],
  }
};

// Submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(login, initialState);
  
  // Show toast on error or handle redirect on success
  useEffect(() => {
    console.log("Login form state updated:", state);
    
    if (state?.error) {
      toast.error(state.error);
      console.log("Login error:", state.error);
    }
    
    // Handle redirect if login was successful
    if (state?.success && state?.redirectTo) {
      console.log("Login successful, redirecting to:", state.redirectTo);
      
      // Use router.refresh() to ensure the auth state is updated before navigation
      router.refresh();
      
      // Then navigate to the dashboard
      console.log("Executing redirect now");
      router.push(state.redirectTo);
    }
  }, [state, router]);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="usernameOrEmail">Username or Email</Label>
            <Input 
              id="usernameOrEmail"
              name="usernameOrEmail" 
              placeholder="Enter your username or email" 
            />
            {state?.fieldErrors?.usernameOrEmail?.map((error: string) => (
              <p key={error} className="text-sm text-destructive">{error}</p>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              name="password" 
              type="password" 
              placeholder="Enter your password" 
            />
            {state?.fieldErrors?.password?.map((error: string) => (
              <p key={error} className="text-sm text-destructive">{error}</p>
            ))}
          </div>
          
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary underline underline-offset-4 hover:text-primary/90">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
