import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { UserConnection } from '../../types/user';

// Get users with pagination query
const GET_USERS_PAGINATED_QUERY = gql`
  query GetUsersPaginated($first: Int, $after: String, $last: Int, $before: String) {
    getUsersPaginated(first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          id
          userName
          email
          createdAt
          updatedAt
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

// Get users with pagination
export const getUsersPaginated = async (
  variables: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }
): Promise<UserConnection> => {
  const { data } = await client.query<{ getUsersPaginated: UserConnection }>({
    query: GET_USERS_PAGINATED_QUERY,
    variables,
    fetchPolicy: 'network-only',
  });
  
  return data.getUsersPaginated;
};
