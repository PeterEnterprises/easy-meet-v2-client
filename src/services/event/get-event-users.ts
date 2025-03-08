import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { User } from '../../types/user';

// Get users participating in an event query
const GET_EVENT_USERS_QUERY = gql`
  query GetEventUsers($eventId: ID!) {
    getEventUsers(eventId: $eventId) {
      id
      userName
      email
    }
  }
`;

// Get users participating in an event
export const getEventUsers = async (eventId: string): Promise<User[]> => {
  const { data } = await client.query<{ getEventUsers: User[] }>({
    query: GET_EVENT_USERS_QUERY,
    variables: { eventId },
    fetchPolicy: 'network-only',
  });
  
  return data.getEventUsers;
};
