import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { User } from '../../types/user';

// Get all users query
const GET_USERS_QUERY = gql`
  query GetUsers {
    getUsers {
      id
      userName
      email
      createdAt
      updatedAt
    }
  }
`;

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const { data } = await client.query<{ getUsers: User[] }>({
    query: GET_USERS_QUERY,
    fetchPolicy: 'network-only',
  });
  
  return data.getUsers;
};
