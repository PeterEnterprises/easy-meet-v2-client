import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { Event } from '../../types/event';

// Get all events query
const GET_EVENTS_QUERY = gql`
  query GetEvents {
    getEvents {
      id
      name
      url
      eventMaker
      usersCanCloseTime
      creator {
        id
        userName
      }
    }
  }
`;

// Get all events
export const getEvents = async (): Promise<Event[]> => {
  const { data } = await client.query<{ getEvents: Event[] }>({
    query: GET_EVENTS_QUERY,
    fetchPolicy: 'network-only',
  });
  
  return data.getEvents;
};
