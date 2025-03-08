import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { UserEventTime } from '../../types/time';

// Get a user's availability for a specific event date query
const GET_USER_AVAILABILITY_QUERY = gql`
  query GetUserAvailability($userId: ID!, $eventId: ID!, $eventDate: DateTime!) {
    getUserAvailability(userId: $userId, eventId: $eventId, eventDate: $eventDate) {
      userId
      eventId
      eventDate
      user {
        id
        userName
        email
      }
      event {
        id
        name
        url
      }
      openTime {
        id
        role
        date
        hours
      }
      closedTime {
        id
        role
        date
        hours
      }
    }
  }
`;

// Get a user's availability for a specific event date
export const getUserAvailability = async (
  userId: string,
  eventId: string,
  eventDate: string
): Promise<UserEventTime> => {
  const { data } = await client.query<{ getUserAvailability: UserEventTime }>({
    query: GET_USER_AVAILABILITY_QUERY,
    variables: { userId, eventId, eventDate },
    fetchPolicy: 'network-only',
  });
  
  return data.getUserAvailability;
};
