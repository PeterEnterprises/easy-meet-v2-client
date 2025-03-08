import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { EventDateConnection } from '../../types/event-date';

// Get dates for an event with pagination query
const GET_EVENT_DATES_PAGINATED_QUERY = gql`
  query GetEventDatesPaginated($eventId: ID!, $first: Int, $after: String, $last: Int, $before: String) {
    getEventDatesPaginated(eventId: $eventId, first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          eventId
          eventDate
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Get dates for an event with pagination
export const getEventDatesPaginated = async (
  eventId: string,
  variables: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }
): Promise<EventDateConnection> => {
  const { data } = await client.query<{ getEventDatesPaginated: EventDateConnection }>({
    query: GET_EVENT_DATES_PAGINATED_QUERY,
    variables: { eventId, ...variables },
    fetchPolicy: 'network-only',
  });
  
  return data.getEventDatesPaginated;
};
