import { gql } from '@apollo/client';
import { client } from '../apollo-client';

// Remove user from event mutation
const REMOVE_USER_FROM_EVENT_MUTATION = gql`
  mutation RemoveUserFromEvent($eventId: ID!, $userId: ID!) {
    removeUserFromEvent(eventId: $eventId, userId: $userId) {
      eventId
      userId
    }
  }
`;

// Remove user from event
export const removeUserFromEvent = async (eventId: string, userId: string): Promise<{ eventId: string; userId: string }> => {
  const { data } = await client.mutate<{ removeUserFromEvent: { eventId: string; userId: string } }>({
    mutation: REMOVE_USER_FROM_EVENT_MUTATION,
    variables: { eventId, userId },
  });
  
  return data?.removeUserFromEvent as { eventId: string; userId: string };
};
