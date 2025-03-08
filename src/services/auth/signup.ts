import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { SignupVariables, SignupResponse } from '../../types/auth';

// Signup mutation
export const SIGNUP_MUTATION = gql`
  mutation Signup($input: CreateUserInput!) {
    signup(input: $input) {
      token
      user {
        id
        userName
        email
      }
    }
  }
`;

// Signup function
export const signup = async (variables: SignupVariables): Promise<SignupResponse> => {
  const { data } = await client.mutate<{ signup: SignupResponse }>({
    mutation: SIGNUP_MUTATION,
    variables,
  });
  
  return data?.signup as SignupResponse;
};
