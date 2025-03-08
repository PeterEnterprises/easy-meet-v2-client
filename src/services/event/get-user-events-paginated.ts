import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { EventConnection } from '../../types/event';

// Get events created by a user with pagination query
const GET_USER_EVENTS_PAGINATED_QUERY = gql`
  query GetUserEventsPaginated($userId: ID!, $first: Int, $after: String, $last: Int, $before: String) {
    getUserEventsPaginated(userId: $userId, first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          id
          name
          url
          eventMaker
          usersCanCloseTime
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

// Get events created by a user with pagination
export const getUserEventsPaginated = async (
  userId: string,
  variables: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }
): Promise<EventConnection> => {
  const { data } = await client.query<{ getUserEventsPaginated: EventConnection }>({
    query: GET_USER_EVENTS_PAGINATED_QUERY,
    variables: { userId, ...variables },
    fetchPolicy: 'network-only',
  });
  
  return data.getUserEventsPaginated;
};
