import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { Event } from '../../types/event';

// Get event by ID query
const GET_EVENT_QUERY = gql`
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      name
      url
      eventMaker
      usersCanCloseTime
      creator {
        id
        userName
        email
      }
      eventDates {
        eventId
        eventDate
      }
      participants {
        userId
        user {
          id
          userName
          email
        }
      }
    }
  }
`;

// Get event by ID
export const getEvent = async (id: string): Promise<Event> => {
  const { data } = await client.query<{ getEvent: Event }>({
    query: GET_EVENT_QUERY,
    variables: { id },
    fetchPolicy: 'network-only',
  });
  
  return data.getEvent;
};
