"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createEventAction } from "@/app/actions/event.action";

// Initial state for form
const initialState = {
  error: null,
  fieldErrors: {
    name: [],
    usersCanCloseTime: [],
  }
};

// Submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Event"}
    </Button>
  );
}

export default function NewEventPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(createEventAction, initialState);
  
  // Show toast on error or handle redirect on success
  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    
    // Handle redirect if event creation was successful
    if (state?.success && state?.redirectTo) {
      toast.success("Event created successfully");
      
      // Use router.refresh() to ensure the auth state is updated before navigation
      router.refresh();
      
      // Then navigate to the event page
      router.push(state.redirectTo);
    }
  }, [state, router]);
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Event</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            Enter the details for your new event. You&apos;ll be able to add dates and invite participants after creating the event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md">
                {state.error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input 
                id="name"
                name="name" 
                placeholder="Team Meeting" 
              />
              {state?.fieldErrors?.name?.map((error: string) => (
                <p key={error} className="text-sm text-destructive">{error}</p>
              ))}
              <p className="text-sm text-muted-foreground">
                Give your event a descriptive name.
              </p>
            </div>
            
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <Checkbox
                id="usersCanCloseTime"
                name="usersCanCloseTime"
                defaultChecked={true}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="usersCanCloseTime">
                  Allow participants to set unavailable times
                </Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, participants can mark times they are not available.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
