"use client";

import { gql } from '@apollo/client';
import { client } from './apollo-client';
import { Time, TimeInput, UserEventTime, UserEventTimeConnection } from '../types/time';
import { Event } from '../types/event';

// Get a user's availability for a specific event date query
export const GET_USER_AVAILABILITY_QUERY = gql`
  query GetUserAvailability($userId: ID!, $eventId: ID!, $eventDate: DateTime!) {
    getUserAvailability(userId: $userId, eventId: $eventId, eventDate: $eventDate) {
      userId
      eventId
      eventDate
      user {
        id
        userName
        email
      }
      event {
        id
        name
        url
      }
      openTime {
        id
        role
        date
        hours
      }
      closedTime {
        id
        role
        date
        hours
      }
    }
  }
`;

// Get all users' availability for a specific event date query
export const GET_EVENT_AVAILABILITY_QUERY = gql`
  query GetEventAvailability($eventId: ID!, $eventDate: DateTime!) {
    getEventAvailability(eventId: $eventId, eventDate: $eventDate) {
      userId
      user {
        id
        userName
        email
      }
      openTime {
        id
        role
        date
        hours
      }
      closedTime {
        id
        role
        date
        hours
      }
    }
  }
`;

// Get all users' availability for a specific event date with pagination query
export const GET_EVENT_AVAILABILITY_PAGINATED_QUERY = gql`
  query GetEventAvailabilityPaginated($eventId: ID!, $eventDate: DateTime!, $first: Int, $after: String, $last: Int, $before: String) {
    getEventAvailabilityPaginated(eventId: $eventId, eventDate: $eventDate, first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          userId
          user {
            id
            userName
            email
          }
          openTime {
            id
            role
            date
            hours
          }
          closedTime {
            id
            role
            date
            hours
          }
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

// Create a time slot mutation
export const CREATE_TIME_MUTATION = gql`
  mutation CreateTime($input: TimeInput!) {
    createTime(input: $input) {
      id
      role
      date
      hours
    }
  }
`;

// Set a user's available time for an event date mutation
export const SET_USER_AVAILABILITY_MUTATION = gql`
  mutation SetUserAvailability($userId: ID!, $eventId: ID!, $eventDate: DateTime!, $openTimeInput: TimeInput) {
    setUserAvailability(userId: $userId, eventId: $eventId, eventDate: $eventDate, openTimeInput: $openTimeInput) {
      userId
      eventId
      eventDate
      openTime {
        id
        role
        date
        hours
      }
    }
  }
`;

// Set a user's unavailable time for an event date mutation
export const SET_USER_UNAVAILABILITY_MUTATION = gql`
  mutation SetUserUnavailability($userId: ID!, $eventId: ID!, $eventDate: DateTime!, $closedTimeInput: TimeInput) {
    setUserUnavailability(userId: $userId, eventId: $eventId, eventDate: $eventDate, closedTimeInput: $closedTimeInput) {
      userId
      eventId
      eventDate
      closedTime {
        id
        role
        date
        hours
      }
    }
  }
`;

// Set the master closed time for an event mutation
export const SET_MASTER_CLOSED_TIME_MUTATION = gql`
  mutation SetMasterClosedTime($eventId: ID!, $timeInput: TimeInput!) {
    setMasterClosedTime(eventId: $eventId, timeInput: $timeInput) {
      id
      name
      url
      masterClosedTime {
        id
        role
        date
        hours
      }
    }
  }
`;

// Get a user's availability for a specific event date
export const getUserAvailability = async (
  userId: string,
  eventId: string,
  eventDate: string
): Promise<UserEventTime> => {
  const { data } = await client.query<{ getUserAvailability: UserEventTime }>({
    query: GET_USER_AVAILABILITY_QUERY,
    variables: { userId, eventId, eventDate },
    fetchPolicy: 'network-only',
  });
  
  return data.getUserAvailability;
};

// Get all users' availability for a specific event date
export const getEventAvailability = async (
  eventId: string,
  eventDate: string
): Promise<UserEventTime[]> => {
  const { data } = await client.query<{ getEventAvailability: UserEventTime[] }>({
    query: GET_EVENT_AVAILABILITY_QUERY,
    variables: { eventId, eventDate },
    fetchPolicy: 'network-only',
  });
  
  return data.getEventAvailability;
};

// Get all users' availability for a specific event date with pagination
export const getEventAvailabilityPaginated = async (
  eventId: string,
  eventDate: string,
  variables: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }
): Promise<UserEventTimeConnection> => {
  const { data } = await client.query<{ getEventAvailabilityPaginated: UserEventTimeConnection }>({
    query: GET_EVENT_AVAILABILITY_PAGINATED_QUERY,
    variables: { eventId, eventDate, ...variables },
    fetchPolicy: 'network-only',
  });
  
  return data.getEventAvailabilityPaginated;
};

// Create a time slot
export const createTime = async (input: TimeInput): Promise<Time> => {
  const { data } = await client.mutate<{ createTime: Time }>({
    mutation: CREATE_TIME_MUTATION,
    variables: { input },
  });
  
  return data?.createTime as Time;
};

// Set a user's available time for an event date
export const setUserAvailability = async (
  userId: string,
  eventId: string,
  eventDate: string,
  openTimeInput?: TimeInput
): Promise<UserEventTime> => {
  const { data } = await client.mutate<{ setUserAvailability: UserEventTime }>({
    mutation: SET_USER_AVAILABILITY_MUTATION,
    variables: { userId, eventId, eventDate, openTimeInput },
  });
  
  return data?.setUserAvailability as UserEventTime;
};

// Set a user's unavailable time for an event date
export const setUserUnavailability = async (
  userId: string,
  eventId: string,
  eventDate: string,
  closedTimeInput?: TimeInput
): Promise<UserEventTime> => {
  const { data } = await client.mutate<{ setUserUnavailability: UserEventTime }>({
    mutation: SET_USER_UNAVAILABILITY_MUTATION,
    variables: { userId, eventId, eventDate, closedTimeInput },
  });
  
  return data?.setUserUnavailability as UserEventTime;
};

// Set the master closed time for an event
export const setMasterClosedTime = async (
  eventId: string,
  timeInput: TimeInput
): Promise<Event> => {
  const { data } = await client.mutate<{ setMasterClosedTime: Event }>({
    mutation: SET_MASTER_CLOSED_TIME_MUTATION,
    variables: { eventId, timeInput },
  });
  
  return data?.setMasterClosedTime as Event;
};
