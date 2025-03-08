import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { LoginVariables, LoginResponse } from '../../types/auth';

// Login mutation
export const LOGIN_MUTATION = gql`
  mutation Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      token
      user {
        id
        userName
        email
      }
    }
  }
`;

// Login function
export const login = async (variables: LoginVariables): Promise<LoginResponse> => {
  const { data } = await client.mutate<{ login: LoginResponse }>({
    mutation: LOGIN_MUTATION,
    variables,
  });
  
  return data?.login as LoginResponse;
};
