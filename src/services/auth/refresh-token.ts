import { gql } from '@apollo/client';
import { client } from '../apollo-client';
import { RefreshTokenVariables, RefreshTokenResponse } from '../../types/auth';

// Refresh token mutation
const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      user {
        id
        userName
        email
      }
    }
  }
`;

// Refresh token function
export const refreshToken = async (variables: RefreshTokenVariables): Promise<RefreshTokenResponse> => {
  const { data } = await client.mutate<{ refreshToken: RefreshTokenResponse }>({
    mutation: REFRESH_TOKEN_MUTATION,
    variables,
  });
  
  return data?.refreshToken as RefreshTokenResponse;
};
