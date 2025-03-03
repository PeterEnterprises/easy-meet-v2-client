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
import { signup } from "@/app/actions/auth.action";

// For debugging
console.log('Signup form component loaded');

// Initial state for form
const initialState = {
  error: null,
  fieldErrors: {
    userName: [],
    email: [],
    password: [],
    confirmPassword: [],
  }
};

// Submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating account..." : "Sign Up"}
    </Button>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(signup, initialState);
  
  // Show toast on error or handle redirect on success
  useEffect(() => {
    console.log("Signup form state updated:", state);
    
    if (state?.error) {
      toast.error(state.error);
      console.log("Signup error:", state.error);
    }
    
    // Handle redirect if signup was successful
    if (state?.success && state?.redirectTo) {
      console.log("Signup successful, redirecting to:", state.redirectTo);
      
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
        <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Sign up to start scheduling meetings
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
            <Label htmlFor="userName">Username</Label>
            <Input 
              id="userName"
              name="userName" 
              placeholder="Enter a username" 
            />
            {state?.fieldErrors?.userName?.map((error: string) => (
              <p key={error} className="text-sm text-destructive">{error}</p>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email" 
              type="email" 
              placeholder="Enter your email" 
            />
            {state?.fieldErrors?.email?.map((error: string) => (
              <p key={error} className="text-sm text-destructive">{error}</p>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              name="password" 
              type="password" 
              placeholder="Create a password" 
            />
            {state?.fieldErrors?.password?.map((error: string) => (
              <p key={error} className="text-sm text-destructive">{error}</p>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword"
              name="confirmPassword" 
              type="password" 
              placeholder="Confirm your password" 
            />
            {state?.fieldErrors?.confirmPassword?.map((error: string) => (
              <p key={error} className="text-sm text-destructive">{error}</p>
            ))}
          </div>
          
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline underline-offset-4 hover:text-primary/90">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
