import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { cookies } from 'next/headers';

// Create a function to get a server-side Apollo client
export async function getClient() {
  console.log('Creating server-side Apollo client');
  
  // Check if the GraphQL endpoint is accessible
  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
    });
    
    if (!response.ok) {
      console.error('GraphQL server is not responding correctly. Status:', response.status);
      const text = await response.text();
      console.error('Response:', text);
    } else {
      console.log('GraphQL server is accessible');
    }
  } catch (error) {
    console.error('Error connecting to GraphQL server:', error);
  }
  
  const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
    // Needed for server-side requests
    fetch,
  });

  const authLink = setContext(async (_, { headers }) => {
    // Get the authentication token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    console.log('Auth token from cookies:', token ? 'Token exists' : 'No token');
    
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
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  // Create the Apollo Client instance
  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
}
