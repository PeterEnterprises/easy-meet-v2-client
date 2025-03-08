import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { UserEventTimeConnection } from '../../types/time';

// Get all users' availability for a specific event date with pagination query
const GET_EVENT_AVAILABILITY_PAGINATED_QUERY = gql`
  query GetEventAvailabilityPaginated($eventId: ID!, $eventDate: DateTime!, $first: Int, $after: String, $last: Int, $before: String) {
    getEventAvailabilityPaginated(eventId: $eventId, eventDate: $eventDate, first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          userId
          user {
            id
            userName
            email
          }
          openTime {
            id
            role
            date
            hours
          }
          closedTime {
            id
            role
            date
            hours
          }
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

// Get all users' availability for a specific event date with pagination
export const getEventAvailabilityPaginated = async (
  eventId: string,
  eventDate: string,
  variables: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }
): Promise<UserEventTimeConnection> => {
  const { data } = await client.query<{ getEventAvailabilityPaginated: UserEventTimeConnection }>({
    query: GET_EVENT_AVAILABILITY_PAGINATED_QUERY,
    variables: { eventId, eventDate, ...variables },
    fetchPolicy: 'network-only',
  });
  
  return data.getEventAvailabilityPaginated;
};
