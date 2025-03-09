"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerMultiple } from "@/components/ui/date-picker-multiple";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import { createEventAction } from "@/app/actions/event.action";
import { userService } from "@/services";
import { User } from "@/types";

// Initial state for form
const initialState = {
  error: null,
  fieldErrors: {
    name: [],
    eventDates: [],
    participants: [],
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
  const [eventDates, setEventDates] = useState<Date[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [users, setUsers] = useState<Option[]>([]);
  
  // Fetch users for participant selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get the current user
        const currentUser = await userService.getCurrentUser();
        
        // Get all users
        const usersList = await userService.getUsers();
        
        // Filter out the current user from the list
        const filteredUsers = currentUser 
          ? usersList.filter(user => user.id !== currentUser.id)
          : usersList;
        
        setUsers(
          filteredUsers.map(user => ({
            label: user.userName,
            value: user.id
          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      }
    };
    
    fetchUsers();
  }, []);
  
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
  
  // Handle form submission with additional data
  const handleSubmit = (formData: FormData) => {
    // Add the selected dates to the form data
    eventDates.forEach((date, index) => {
      formData.append(`eventDates[${index}]`, date.toISOString());
    });
    
    // Add the selected participants to the form data
    participants.forEach((participantId, index) => {
      formData.append(`participants[${index}]`, participantId);
    });
    
    // Submit the form
    formAction(formData);
  };
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Event</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            Enter the details for your new event including dates and participants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
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
            
            <div className="space-y-2">
              <Label>Event Dates</Label>
              <DatePickerMultiple 
                dates={eventDates}
                onChange={setEventDates}
                placeholder="Select dates"
              />
              {state?.fieldErrors?.eventDates?.map((error: string) => (
                <p key={error} className="text-sm text-destructive">{error}</p>
              ))}
              <p className="text-sm text-muted-foreground">
                Add one or more dates for your event.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Participants (Optional)</Label>
              <MultiSelect 
                options={users}
                selected={participants}
                onChange={setParticipants}
                placeholder="Select participants"
              />
              {state?.fieldErrors?.participants?.map((error: string) => (
                <p key={error} className="text-sm text-destructive">{error}</p>
              ))}
              <p className="text-sm text-muted-foreground">
                Select participants to invite to your event. You will be automatically added as a participant, so you don't need to select yourself.
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
