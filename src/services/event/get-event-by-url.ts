import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { Event } from '../../types/event';

// Get event by URL query
const GET_EVENT_BY_URL_QUERY = gql`
  query GetEventByUrl($url: String!) {
    getEventByUrl(url: $url) {
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

// Get event by URL
export const getEventByUrl = async (url: string): Promise<Event> => {
  const { data } = await client.query<{ getEventByUrl: Event }>({
    query: GET_EVENT_BY_URL_QUERY,
    variables: { url },
    fetchPolicy: 'network-only',
  });
  
  return data.getEventByUrl;
};
