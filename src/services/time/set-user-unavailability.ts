import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { UserEventTime, TimeInput } from '../../types/time';

// Set a user's unavailable time for an event date mutation
const SET_USER_UNAVAILABILITY_MUTATION = gql`
  mutation SetUserUnavailability($userId: ID!, $eventId: ID!, $eventDate: DateTime!, $closedTimeInput: TimeInput) {
    setUserUnavailability(userId: $userId, eventId: $eventId, eventDate: $eventDate, closedTimeInput: $closedTimeInput) {
      userId
      eventId
      eventDate
      closedTime {
        id
        role
        date
        hours
      }
    }
  }
`;

// Set a user's unavailable time for an event date
export const setUserUnavailability = async (
  userId: string,
  eventId: string,
  eventDate: string,
  closedTimeInput?: TimeInput
): Promise<UserEventTime> => {
  const { data } = await client.mutate<{ setUserUnavailability: UserEventTime }>({
    mutation: SET_USER_UNAVAILABILITY_MUTATION,
    variables: { userId, eventId, eventDate, closedTimeInput },
  });
  
  return data?.setUserUnavailability as UserEventTime;
};
