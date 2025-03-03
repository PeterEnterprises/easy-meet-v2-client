import { Metadata } from "next";
import { SignupForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign Up - EZ Meet",
  description: "Create a new EZ Meet account",
};

export default function SignupPage() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to create a new account
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
