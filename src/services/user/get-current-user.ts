import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { User } from '../../types/user';

// Get current user query
const ME_QUERY = gql`
  query Me {
    me {
      id
      userName
      email
      createdAt
      updatedAt
    }
  }
`;

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await client.query<{ me: User }>({
      query: ME_QUERY,
      fetchPolicy: 'network-only',
    });
    
    return data.me;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};
