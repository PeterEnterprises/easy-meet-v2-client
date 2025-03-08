import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { UserEventTime, TimeInput } from '../../types/time';

// Set a user's available time for an event date mutation
const SET_USER_AVAILABILITY_MUTATION = gql`
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
`;

// Set a user's available time for an event date
export const setUserAvailability = async (
  userId: string,
  eventId: string,
  eventDate: string,
  openTimeInput?: TimeInput
): Promise<UserEventTime> => {
  const { data } = await client.mutate<{ setUserAvailability: UserEventTime }>({
    mutation: SET_USER_AVAILABILITY_MUTATION,
    variables: { userId, eventId, eventDate, openTimeInput },
  });
  
  return data?.setUserAvailability as UserEventTime;
};
