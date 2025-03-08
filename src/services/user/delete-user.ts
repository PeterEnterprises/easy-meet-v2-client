import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { User } from '../../types/user';

// Delete user mutation
const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      userName
      email
    }
  }
`;

// Delete user
export const deleteUser = async (id: string): Promise<User> => {
  const { data } = await client.mutate<{ deleteUser: User }>({
    mutation: DELETE_USER_MUTATION,
    variables: { id },
  });
  
  return data?.deleteUser as User;
};
