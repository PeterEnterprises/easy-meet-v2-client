import { gql } from '@apollo/client';
import { client } from '../apollo-client';

// Add user to event mutation
const ADD_USER_TO_EVENT_MUTATION = gql`
  mutation AddUserToEvent($eventId: ID!, $userId: ID!) {
    addUserToEvent(eventId: $eventId, userId: $userId) {
      eventId
      userId
    }
  }
`;

// Add user to event
export const addUserToEvent = async (eventId: string, userId: string): Promise<{ eventId: string; userId: string }> => {
  const { data } = await client.mutate<{ addUserToEvent: { eventId: string; userId: string } }>({
    mutation: ADD_USER_TO_EVENT_MUTATION,
    variables: { eventId, userId },
  });
  
  return data?.addUserToEvent as { eventId: string; userId: string };
};
