import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { UserEventTime } from '../../types/time';

// Get all users' availability for a specific event date query
const GET_EVENT_AVAILABILITY_QUERY = gql`
  query GetEventAvailability($eventId: ID!, $eventDate: DateTime!) {
    getEventAvailability(eventId: $eventId, eventDate: $eventDate) {
      userId
      user {
        id
        userName
        email
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

// Get all users' availability for a specific event date
export const getEventAvailability = async (
  eventId: string,
  eventDate: string
): Promise<UserEventTime[]> => {
  const { data } = await client.query<{ getEventAvailability: UserEventTime[] }>({
    query: GET_EVENT_AVAILABILITY_QUERY,
    variables: { eventId, eventDate },
    fetchPolicy: 'network-only',
  });
  
  return data.getEventAvailability;
};
