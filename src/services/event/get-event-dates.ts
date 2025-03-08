import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { EventDate } from '../../types/event-date';

// Get dates for an event query
const GET_EVENT_DATES_QUERY = gql`
  query GetEventDates($eventId: ID!) {
    getEventDates(eventId: $eventId) {
      eventId
      eventDate
    }
  }
`;

// Get dates for an event
export const getEventDates = async (eventId: string): Promise<EventDate[]> => {
  const { data } = await client.query<{ getEventDates: EventDate[] }>({
    query: GET_EVENT_DATES_QUERY,
    variables: { eventId },
    fetchPolicy: 'network-only',
  });
  
  return data.getEventDates;
};
