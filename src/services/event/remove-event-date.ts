import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { EventDate } from '../../types/event-date';

// Remove date from event mutation
const REMOVE_EVENT_DATE_MUTATION = gql`
  mutation RemoveEventDate($eventId: ID!, $eventDate: DateTime!) {
    removeEventDate(eventId: $eventId, eventDate: $eventDate) {
      eventId
      eventDate
    }
  }
`;

// Remove date from event
export const removeEventDate = async (eventId: string, eventDate: string): Promise<EventDate> => {
  const { data } = await client.mutate<{ removeEventDate: EventDate }>({
    mutation: REMOVE_EVENT_DATE_MUTATION,
    variables: { eventId, eventDate },
  });
  
  return data?.removeEventDate as EventDate;
};
