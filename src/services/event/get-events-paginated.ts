import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { EventConnection } from '../../types/event';

// Get events with pagination query
const GET_EVENTS_PAGINATED_QUERY = gql`
  query GetEventsPaginated($first: Int, $after: String, $last: Int, $before: String) {
    getEventsPaginated(first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          id
          name
          url
          eventMaker
          usersCanCloseTime
          creator {
            id
            userName
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

// Get events with pagination
export const getEventsPaginated = async (
  variables: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }
): Promise<EventConnection> => {
  const { data } = await client.query<{ getEventsPaginated: EventConnection }>({
    query: GET_EVENTS_PAGINATED_QUERY,
    variables,
    fetchPolicy: 'network-only',
  });
  
  return data.getEventsPaginated;
};
