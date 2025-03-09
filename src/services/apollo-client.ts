"use client";

import { ApolloClient, InMemoryCache, createHttpLink, from, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

// Function to get token from cookies
function getTokenFromCookie() {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  
  if (!tokenCookie) return null;
  
  return tokenCookie.split('=')[1].trim();
}

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from cookies to match server-side behavior
  const token = getTokenFromCookie();
  
  console.log('Client-side auth token from cookie:', token ? 'Token exists' : 'No token');
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Code: ${extensions?.code}`
      );
      
      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED' && typeof window !== 'undefined') {
        // Redirect to login page
        window.location.href = '/login';
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// WebSocket link for subscriptions
const wsLink = typeof window !== 'undefined' 
  ? new GraphQLWsLink(
      createClient({
        url: 'ws://localhost:4000/graphql',
        connectionParams: () => {
          const token = getTokenFromCookie();
          return {
            authorization: token ? `Bearer ${token}` : "",
          };
        },
      })
    )
  : null;

// Split link based on operation type
const splitLink = typeof window !== 'undefined' && wsLink != null
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink
    )
  : httpLink;

// Create the Apollo Client instance
export const client = new ApolloClient({
  link: from([errorLink, authLink, splitLink]),
  cache: new InMemoryCache(),
});

// Function to reset the Apollo Client store (useful for logout)
export const resetApolloStore = async () => {
  await client.resetStore();
};
