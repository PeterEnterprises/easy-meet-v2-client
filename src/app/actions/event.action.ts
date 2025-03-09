'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { gql } from '@apollo/client'
import { getClient } from '@/lib/apollo-server'
import { eventService, userService } from '@/services'
import { CreateEventInput } from '@/types'

// Define types for form state
interface EventFormState {
  error?: string | null;
  fieldErrors?: {
    name?: string[];
    eventDates?: string[];
    participants?: string[];
    usersCanCloseTime?: string[];
  };
  success?: boolean;
  redirectTo?: string;
  eventId?: string;
}

// Event schema for validation
const eventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  eventDates: z.array(z.string().datetime()).min(1, "At least one event date is required"),
  participants: z.array(z.string()).optional(),
  usersCanCloseTime: z.preprocess(
    // Convert checkbox value to boolean
    (val) => val === 'on' || val === 'true' || val === true,
    z.boolean().default(true)
  ),
})

// Helper function to extract array values from FormData
function getFormDataArray(formData: FormData, key: string): string[] {
  const result: string[] = [];
  
  // Loop through all form data entries
  for (const [name, value] of formData.entries()) {
    // Check if the name matches the pattern key[index]
    const match = name.match(new RegExp(`^${key}\\[(\\d+)\\]$`));
    if (match) {
      result.push(value.toString());
    }
  }
  
  return result;
}

// Create event action
export async function createEventAction(
  prevState: EventFormState, 
  formData: FormData
): Promise<EventFormState> {
  // Extract array values from FormData
  const eventDates = getFormDataArray(formData, 'eventDates');
  const participants = getFormDataArray(formData, 'participants');
  
  // Validate form data
  const validatedFields = eventSchema.safeParse({
    name: formData.get('name'),
    eventDates,
    participants,
    usersCanCloseTime: formData.get('usersCanCloseTime'),
  })
  
  if (!validatedFields.success) {
    return { 
      error: "Invalid fields", 
      fieldErrors: validatedFields.error.flatten().fieldErrors 
    }
  }
  
  const { name, eventDates: validatedDates, participants: validatedParticipants, usersCanCloseTime } = validatedFields.data
  
  try {
    console.log('Creating event:', { name, eventDates: validatedDates, participants: validatedParticipants, usersCanCloseTime });
    
    // Use server-side Apollo client
    const client = await getClient()
    
    try {
      // Step 1: Create the event
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
      
      if (!data?.createEvent) {
        return { error: "Failed to create event. Please try again." }
      }
      
      const eventId = data.createEvent.id;
      
      // Step 2: Get the current user to add as a participant
      let currentUser;
      try {
        const { data: userData } = await client.query({
          query: gql`
            query Me {
              me {
                id
                userName
                email
              }
            }
          `,
          fetchPolicy: 'network-only',
        });
        
        if (!userData?.me) {
          return { 
            error: "Failed to get current user. Please try again.",
            eventId
          }
        }
        
        currentUser = userData.me;
      } catch (error) {
        console.error('Error fetching current user:', error);
        return { 
          error: "Failed to get current user. Please try again.",
          eventId
        }
      }

      // Step 4: Add all event dates
      for (const dateString of validatedDates) {
        await client.mutate({
          mutation: gql`
            mutation AddEventDate($eventId: ID!, $eventDate: DateTime!) {
              addEventDate(eventId: $eventId, eventDate: $eventDate) {
                eventId
                eventDate
              }
            }
          `,
          variables: { 
            eventId,
            eventDate: dateString
          },
        })
        
        // Create UserEventTime entry for the owner (current user) for this date
        await client.mutate({
          mutation: gql`
            mutation SetUserAvailability($userId: ID!, $eventId: ID!, $eventDate: DateTime!, $openTimeInput: TimeInput) {
              setUserAvailability(userId: $userId, eventId: $eventId, eventDate: $eventDate, openTimeInput: $openTimeInput) {
                userId
                eventId
                eventDate
                openTime {
                  id
                  role
                  date
                  hours
                }
              }
            }
          `,
          variables: { 
            userId: currentUser.id,
            eventId,
            eventDate: dateString,
            openTimeInput: {
              role: "User",
              date: dateString,
              hours: Array(24).fill(false) // Default to all hours unavailable
            }
          },
        })
      }
      
      // Step 5: Add all selected participants (if any)
      if (validatedParticipants && validatedParticipants.length > 0) {
        console.log('Adding selected participants:', validatedParticipants);
        console.log('Current user ID:', currentUser.id);
        
        for (const participantId of validatedParticipants) {
          // Skip if the participant is the current user (already added)
          if (participantId === currentUser.id) {
            console.log(`Skipping current user (${participantId}) as they are already a participant`);
            continue;
          }
          
          console.log(`Adding participant: ${participantId}`);
          await client.mutate({
            mutation: gql`
              mutation AddUserToEvent($eventId: ID!, $userId: ID!) {
                addUserToEvent(eventId: $eventId, userId: $userId) {
                  eventId
                  userId
                }
              }
            `,
            variables: { 
              eventId,
              userId: participantId
            },
          })
          
          // Create UserEventTime entries for each participant for each event date
          for (const dateString of validatedDates) {
            await client.mutate({
              mutation: gql`
                mutation SetUserAvailability($userId: ID!, $eventId: ID!, $eventDate: DateTime!, $openTimeInput: TimeInput) {
                  setUserAvailability(userId: $userId, eventId: $eventId, eventDate: $eventDate, openTimeInput: $openTimeInput) {
                    userId
                    eventId
                    eventDate
                    openTime {
                      id
                      role
                      date
                      hours
                    }
                  }
                }
              `,
              variables: { 
                userId: participantId,
                eventId,
                eventDate: dateString,
                openTimeInput: {
                  role: "User",
                  date: dateString,
                  hours: Array(24).fill(false) // Default to all hours unavailable
                }
              },
            })
          }
        }
      } else {
        console.log('No additional participants to add');
      }
      
      return {
        success: true,
        redirectTo: `/events/${eventId}`,
        eventId
      };
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
