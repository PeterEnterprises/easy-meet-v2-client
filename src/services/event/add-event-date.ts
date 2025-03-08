import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { EventDate } from '../../types/event-date';

// Add date to event mutation
const ADD_EVENT_DATE_MUTATION = gql`
  mutation AddEventDate($eventId: ID!, $eventDate: DateTime!) {
    addEventDate(eventId: $eventId, eventDate: $eventDate) {
      eventId
      eventDate
    }
  }
`;

// Add date to event
export const addEventDate = async (eventId: string, eventDate: string): Promise<EventDate> => {
  const { data } = await client.mutate<{ addEventDate: EventDate }>({
    mutation: ADD_EVENT_DATE_MUTATION,
    variables: { eventId, eventDate },
  });
  
  return data?.addEventDate as EventDate;
};
