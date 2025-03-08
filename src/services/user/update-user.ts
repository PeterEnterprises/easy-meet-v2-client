import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { User, UpdateUserInput } from '../../types/user';

// Update user mutation
const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      userName
      email
      createdAt
      updatedAt
    }
  }
`;

// Update user
export const updateUser = async (id: string, input: UpdateUserInput): Promise<User> => {
  const { data } = await client.mutate<{ updateUser: User }>({
    mutation: UPDATE_USER_MUTATION,
    variables: { id, input },
  });
  
  return data?.updateUser as User;
};
