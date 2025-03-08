'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { gql } from '@apollo/client'
import { getClient } from '@/lib/apollo-server'
import { eventService } from '@/services'
import { CreateEventInput } from '@/types'

// Define types for form state
interface EventFormState {
  error?: string | null;
  fieldErrors?: {
    name?: string[];
    usersCanCloseTime?: string[];
  };
  success?: boolean;
  redirectTo?: string;
  eventId?: string;
}

// Event schema for validation
const eventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  usersCanCloseTime: z.preprocess(
    // Convert checkbox value to boolean
    (val) => val === 'on' || val === 'true' || val === true,
    z.boolean().default(true)
  ),
})

// Create event action
export async function createEventAction(
  prevState: EventFormState, 
  formData: FormData
): Promise<EventFormState> {
  // Validate form data
  const validatedFields = eventSchema.safeParse({
    name: formData.get('name'),
    usersCanCloseTime: formData.get('usersCanCloseTime'),
  })
  
  if (!validatedFields.success) {
    return { 
      error: "Invalid fields", 
      fieldErrors: validatedFields.error.flatten().fieldErrors 
    }
  }
  
  const { name, usersCanCloseTime } = validatedFields.data
  
  try {
    console.log('Creating event:', { name, usersCanCloseTime });
    
    // Use server-side Apollo client
    const client = await getClient()
    
    try {
      const { data } = await client.mutate({
        mutation: gql`
          mutation CreateEvent($input: CreateEventInput!) {
            createEvent(input: $input) {
              id
              name
              url
              eventMaker
              usersCanCloseTime
            }
          }
        `,
        variables: { 
          input: { name, usersCanCloseTime } as CreateEventInput
        },
      })
      
      console.log('Create event mutation response:', data);
      
      if (data?.createEvent) {
        return {
          success: true,
          redirectTo: `/events/${data.createEvent.id}`,
          eventId: data.createEvent.id
        };
      }
      
      return { error: "Failed to create event. Please try again." }
    } catch (error: unknown) {
      // Type guard for Apollo errors
      const apolloError = error as { graphQLErrors?: Array<{ message: string }> };
      console.error('GraphQL mutation error:', error);
      
      if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
        const graphQLError = apolloError.graphQLErrors[0];
        return { error: graphQLError.message || "Failed to create event. Please try again." };
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Event creation error:', error);
    return { error: "Failed to create event. Please try again." }
  }
}
