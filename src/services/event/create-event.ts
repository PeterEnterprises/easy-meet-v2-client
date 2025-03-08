import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { Event, CreateEventInput } from '../../types/event';

// Create event mutation
export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      name
      url
      eventMaker
      usersCanCloseTime
    }
  }
`;

// Create event
export const createEvent = async (input: CreateEventInput): Promise<Event> => {
  const { data } = await client.mutate<{ createEvent: Event }>({
    mutation: CREATE_EVENT_MUTATION,
    variables: { input },
  });
  
  return data?.createEvent as Event;
};
