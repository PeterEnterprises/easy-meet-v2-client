"use client";

import { gql } from '@apollo/client';
import { client } from './apollo-client';
import { User, UserConnection, UpdateUserInput } from '../types/user';

// Get user by ID query
export const GET_USER_QUERY = gql`
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

// Get all users query
export const GET_USERS_QUERY = gql`
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

// Get users with pagination query
export const GET_USERS_PAGINATED_QUERY = gql`
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

// Get current user query
export const ME_QUERY = gql`
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

// Update user mutation
export const UPDATE_USER_MUTATION = gql`
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

// Delete user mutation
export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      userName
      email
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

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const { data } = await client.query<{ getUsers: User[] }>({
    query: GET_USERS_QUERY,
    fetchPolicy: 'network-only',
  });
  
  return data.getUsers;
};

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

// Update user
export const updateUser = async (id: string, input: UpdateUserInput): Promise<User> => {
  const { data } = await client.mutate<{ updateUser: User }>({
    mutation: UPDATE_USER_MUTATION,
    variables: { id, input },
  });
  
  return data?.updateUser as User;
};

// Delete user
export const deleteUser = async (id: string): Promise<User> => {
  const { data } = await client.mutate<{ deleteUser: User }>({
    mutation: DELETE_USER_MUTATION,
    variables: { id },
  });
  
  return data?.deleteUser as User;
};
