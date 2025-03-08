import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { Event } from '../../types/event';

// Delete event mutation
const DELETE_EVENT_MUTATION = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
      name
      url
    }
  }
`;

// Delete event
export const deleteEvent = async (id: string): Promise<Event> => {
  const { data } = await client.mutate<{ deleteEvent: Event }>({
    mutation: DELETE_EVENT_MUTATION,
    variables: { id },
  });
  
  return data?.deleteEvent as Event;
};
