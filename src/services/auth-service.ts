"use client";

import { gql } from '@apollo/client';
import { client } from './apollo-client';
import { 
  LoginVariables, 
  SignupVariables, 
  RefreshTokenVariables,
  LoginResponse,
  SignupResponse,
  RefreshTokenResponse
} from '../types/auth';

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

// Refresh token mutation
export const REFRESH_TOKEN_MUTATION = gql`
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

// Login function
export const login = async (variables: LoginVariables): Promise<LoginResponse> => {
  const { data } = await client.mutate<{ login: LoginResponse }>({
    mutation: LOGIN_MUTATION,
    variables,
  });
  
  if (data?.login) {
    // Store the token in localStorage
    localStorage.setItem('token', data.login.token);
  }
  
  return data?.login as LoginResponse;
};

// Signup function
export const signup = async (variables: SignupVariables): Promise<SignupResponse> => {
  const { data } = await client.mutate<{ signup: SignupResponse }>({
    mutation: SIGNUP_MUTATION,
    variables,
  });
  
  if (data?.signup) {
    // Store the token in localStorage
    localStorage.setItem('token', data.signup.token);
  }
  
  return data?.signup as SignupResponse;
};

// Refresh token function
export const refreshToken = async (variables: RefreshTokenVariables): Promise<RefreshTokenResponse> => {
  const { data } = await client.mutate<{ refreshToken: RefreshTokenResponse }>({
    mutation: REFRESH_TOKEN_MUTATION,
    variables,
  });
  
  if (data?.refreshToken) {
    // Update the token in localStorage
    localStorage.setItem('token', data.refreshToken.token);
  }
  
  return data?.refreshToken as RefreshTokenResponse;
};

// Logout function
export const logout = (): void => {
  // Remove the token from localStorage
  localStorage.removeItem('token');
  
  // Redirect to login page
  window.location.href = '/login';
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = localStorage.getItem('token');
  return !!token;
};

// Get current token
export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('token');
};
