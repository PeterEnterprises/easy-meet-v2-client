import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { User } from '../../types/user';

// Get user by ID query
const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      userName
      email
      createdAt
      updatedAt
    }
  }
`;

// Get user by ID
export const getUser = async (id: string): Promise<User> => {
  const { data } = await client.query<{ getUser: User }>({
    query: GET_USER_QUERY,
    variables: { id },
    fetchPolicy: 'network-only',
  });
  
  return data.getUser;
};
