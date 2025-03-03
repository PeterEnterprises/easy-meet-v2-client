'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { gql } from '@apollo/client'
import { getClient } from '@/lib/apollo-server'
import { LoginVariables, SignupVariables } from '@/types/auth'

// Define types for form state
interface LoginFormState {
  error?: string | null;
  fieldErrors?: {
    usernameOrEmail?: string[];
    password?: string[];
  };
  success?: boolean;
  redirectTo?: string;
}

interface SignupFormState {
  error?: string | null;
  fieldErrors?: {
    userName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  success?: boolean;
  redirectTo?: string;
}

// Login schema for validation
const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
})

// Signup schema for validation
const signupSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

// Login action
export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  // Validate form data
  const validatedFields = loginSchema.safeParse({
    usernameOrEmail: formData.get('usernameOrEmail'),
    password: formData.get('password'),
  })
  console.log('DO I MAKE IT HERE?');
  if (!validatedFields.success) {
    return { 
      error: "Invalid fields", 
      fieldErrors: validatedFields.error.flatten().fieldErrors 
    }
  }
  
  const { usernameOrEmail, password } = validatedFields.data
  
  try {
    console.log('Login attempt:', { usernameOrEmail, password: '***' });
    
    // For debugging - to see if valid credentials are being rejected
    console.log('IMPORTANT: If you have valid credentials, please check the server logs for authentication issues');
    
    // Use server-side Apollo client
    const client = await getClient()
    console.log('Apollo client created');
    
    try {
      // Make the GraphQL mutation request
      const { data } = await client.mutate({
        mutation: gql`
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
        `,
        variables: { usernameOrEmail, password } as LoginVariables,
      })
      
      console.log('Login mutation response:', data);
      
      if (data?.login) {
        // Store token in cookies - one HTTP-only for server and one accessible for client
        const cookieStore = await cookies()
        
        // Set the HTTP-only cookie for server-side authentication
        cookieStore.set('token', data.login.token, { 
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        })
        
        // Also set a non-HTTP-only cookie with the same name for client-side access
        // This is a workaround to ensure both server and client can access the token
        cookieStore.set('token', data.login.token, { 
          httpOnly: false, // Allow JavaScript access
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/', // Ensure cookie is available across the site
        })
        
        console.log('Token stored in cookies, redirecting to dashboard');
        
        // Return a special response to handle the redirect on the client side
        return {
          success: true,
          redirectTo: '/dashboard'
        };
      }
      
      console.log('Login failed, no data returned');
      return { error: "Login failed. Please check your credentials." }
    } catch (error: unknown) {
      // Type guard for Apollo errors
      const apolloError = error as { graphQLErrors?: Array<{ message: string }> };
      console.error('GraphQL mutation error:', error);
      
      // Check if it's an Apollo error with GraphQL errors
      if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
        const graphQLError = apolloError.graphQLErrors[0];
        console.error('GraphQL error details:', graphQLError);
        
        return { 
          error: graphQLError.message || "Authentication failed. Please try again." 
        };
      }
      
      throw error; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error('Login error:', error);
    return { error: "Authentication failed. Please try again." }
  }
}

// Signup action
export async function signup(prevState: SignupFormState, formData: FormData): Promise<SignupFormState> {
  // Validate form data
  const validatedFields = signupSchema.safeParse({
    userName: formData.get('userName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })
  
  if (!validatedFields.success) {
    return { 
      error: "Invalid fields", 
      fieldErrors: validatedFields.error.flatten().fieldErrors 
    }
  }
  
  const { userName, email, password } = validatedFields.data
  
  try {
    console.log('Signup attempt:', { userName, email, password: '***' });
    
    // Use server-side Apollo client
    const client = await getClient()
    console.log('Apollo client created');
    
    try {
      const { data } = await client.mutate({
        mutation: gql`
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
        `,
        variables: { 
          input: { userName, email, password } 
        } as SignupVariables,
      })
      
      console.log('Signup mutation response:', data);
      
    if (data?.signup) {
      // Store token in cookies - one HTTP-only for server and one accessible for client
      const cookieStore = await cookies()
      
      // Set the HTTP-only cookie for server-side authentication
      cookieStore.set('token', data.signup.token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
      
      // Also set a non-HTTP-only cookie with the same name for client-side access
      // This is a workaround to ensure both server and client can access the token
      cookieStore.set('token', data.signup.token, { 
        httpOnly: false, // Allow JavaScript access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/', // Ensure cookie is available across the site
      })
      
      console.log('Token stored in cookies, redirecting to dashboard');
      
      // Return a special response to handle the redirect on the client side
      return {
        success: true,
        redirectTo: '/dashboard'
      };
    }
      
      console.log('Signup failed, no data returned');
      return { error: "Signup failed. Please try again." }
    } catch (error: unknown) {
      // Type guard for Apollo errors
      const apolloError = error as { graphQLErrors?: Array<{ message: string }> };
      console.error('GraphQL mutation error:', error);
      
      // Check if it's an Apollo error with GraphQL errors
      if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
        const graphQLError = apolloError.graphQLErrors[0];
        console.error('GraphQL error details:', graphQLError);
        
        return { 
          error: graphQLError.message || "Account creation failed. Please try again." 
        };
      }
      
      throw error; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error('Signup error:', error);
    return { error: "Account creation failed. Please try again." }
  }
}

// Logout action
export async function logout() {
  const cookieStore = await cookies()
  
  // Delete both the HTTP-only and non-HTTP-only cookies
  cookieStore.delete('token')
  
  // Ensure the cookie is deleted with the same path setting
  cookieStore.set('token', '', { 
    expires: new Date(0),
    path: '/',
  })
  
  console.log('User logged out, cookies cleared');
  redirect('/login')
}

// Get current user action
export async function getCurrentUser() {
  try {
    const client = await getClient()
    const { data } = await client.query({
      query: gql`
        query Me {
          me {
            id
            userName
            email
            createdAt
            updatedAt
          }
        }
      `,
      fetchPolicy: 'network-only',
    })
    
    return data?.me || null
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  return !!token
}
