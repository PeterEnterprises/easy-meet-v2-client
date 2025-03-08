import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { Event, UpdateEventInput } from '../../types/event';

// Update event mutation
const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      name
      url
      eventMaker
      usersCanCloseTime
    }
  }
`;

// Update event
export const updateEvent = async (id: string, input: UpdateEventInput): Promise<Event> => {
  const { data } = await client.mutate<{ updateEvent: Event }>({
    mutation: UPDATE_EVENT_MUTATION,
    variables: { id, input },
  });
  
  return data?.updateEvent as Event;
};
