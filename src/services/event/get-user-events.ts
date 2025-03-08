import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { Event } from '../../types/event';

// Get events created by a user query
const GET_USER_EVENTS_QUERY = gql`
  query GetUserEvents($userId: ID!) {
    getUserEvents(userId: $userId) {
      id
      name
      url
      eventMaker
      usersCanCloseTime
    }
  }
`;

// Get events created by a user
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  const { data } = await client.query<{ getUserEvents: Event[] }>({
    query: GET_USER_EVENTS_QUERY,
    variables: { userId },
    fetchPolicy: 'network-only',
  });
  
  return data.getUserEvents;
};
