import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { Event } from '../../types/event';
import { TimeInput } from '../../types/time';

// Set the master closed time for an event mutation
const SET_MASTER_CLOSED_TIME_MUTATION = gql`
  mutation SetMasterClosedTime($eventId: ID!, $timeInput: TimeInput!) {
    setMasterClosedTime(eventId: $eventId, timeInput: $timeInput) {
      id
      name
      url
      masterClosedTime {
        id
        role
        date
        hours
      }
    }
  }
`;

// Set the master closed time for an event
export const setMasterClosedTime = async (
  eventId: string,
  timeInput: TimeInput
): Promise<Event> => {
  const { data } = await client.mutate<{ setMasterClosedTime: Event }>({
    mutation: SET_MASTER_CLOSED_TIME_MUTATION,
    variables: { eventId, timeInput },
  });
  
  return data?.setMasterClosedTime as Event;
};
