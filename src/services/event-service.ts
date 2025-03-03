"use client";

import { gql } from '@apollo/client';
import { client } from './apollo-client';
import { Event, EventConnection, CreateEventInput, UpdateEventInput } from '../types/event';
import { EventDate, EventDateConnection } from '../types/event-date';
import { User } from '../types/user';

// Get event by ID query
export const GET_EVENT_QUERY = gql`
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      name
      url
      eventMaker
      usersCanCloseTime
      creator {
        id
        userName
        email
      }
      eventDates {
        eventId
        eventDate
      }
      participants {
        userId
        user {
          id
          userName
          email
        }
      }
    }
  }
`;

// Get event by URL query
export const GET_EVENT_BY_URL_QUERY = gql`
  query GetEventByUrl($url: String!) {
    getEventByUrl(url: $url) {
      id
      name
      url
      eventMaker
      usersCanCloseTime
      creator {
        id
        userName
        email
      }
      eventDates {
        eventId
        eventDate
      }
      participants {
        userId
        user {
          id
          userName
          email
        }
      }
    }
  }
`;

// Get all events query
export const GET_EVENTS_QUERY = gql`
  query GetEvents {
    getEvents {
      id
      name
      url
      eventMaker
      usersCanCloseTime
      creator {
        id
        userName
      }
    }
  }
`;

// Get events with pagination query
export const GET_EVENTS_PAGINATED_QUERY = gql`
  query GetEventsPaginated($first: Int, $after: String, $last: Int, $before: String) {
    getEventsPaginated(first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          id
          name
          url
          eventMaker
          usersCanCloseTime
          creator {
            id
            userName
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

// Get events created by a user query
export const GET_USER_EVENTS_QUERY = gql`
  query GetUserEvents($userId: ID!) {
    getUserEvents(userId: $userId) {
      id
      name
      url
      eventMaker
      usersCanCloseTime
    }
  }
`;

// Get events created by a user with pagination query
export const GET_USER_EVENTS_PAGINATED_QUERY = gql`
  query GetUserEventsPaginated($userId: ID!, $first: Int, $after: String, $last: Int, $before: String) {
    getUserEventsPaginated(userId: $userId, first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          id
          name
          url
          eventMaker
          usersCanCloseTime
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

// Get dates for an event query
export const GET_EVENT_DATES_QUERY = gql`
  query GetEventDates($eventId: ID!) {
    getEventDates(eventId: $eventId) {
      eventId
      eventDate
    }
  }
`;

// Get dates for an event with pagination query
export const GET_EVENT_DATES_PAGINATED_QUERY = gql`
  query GetEventDatesPaginated($eventId: ID!, $first: Int, $after: String, $last: Int, $before: String) {
    getEventDatesPaginated(eventId: $eventId, first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          eventId
          eventDate
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

// Get users participating in an event query
export const GET_EVENT_USERS_QUERY = gql`
  query GetEventUsers($eventId: ID!) {
    getEventUsers(eventId: $eventId) {
      id
      userName
      email
    }
  }
`;

// Create event mutation
export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      name
      url
      eventMaker
      usersCanCloseTime
    }
  }
`;

// Update event mutation
export const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      name
      url
      eventMaker
      usersCanCloseTime
    }
  }
`;

// Delete event mutation
export const DELETE_EVENT_MUTATION = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
      name
      url
    }
  }
`;

// Add date to event mutation
export const ADD_EVENT_DATE_MUTATION = gql`
  mutation AddEventDate($eventId: ID!, $eventDate: DateTime!) {
    addEventDate(eventId: $eventId, eventDate: $eventDate) {
      eventId
      eventDate
    }
  }
`;

// Remove date from event mutation
export const REMOVE_EVENT_DATE_MUTATION = gql`
  mutation RemoveEventDate($eventId: ID!, $eventDate: DateTime!) {
    removeEventDate(eventId: $eventId, eventDate: $eventDate) {
      eventId
      eventDate
    }
  }
`;

// Add user to event mutation
export const ADD_USER_TO_EVENT_MUTATION = gql`
  mutation AddUserToEvent($eventId: ID!, $userId: ID!) {
    addUserToEvent(eventId: $eventId, userId: $userId) {
      eventId
      userId
    }
  }
`;

// Remove user from event mutation
export const REMOVE_USER_FROM_EVENT_MUTATION = gql`
  mutation RemoveUserFromEvent($eventId: ID!, $userId: ID!) {
    removeUserFromEvent(eventId: $eventId, userId: $userId) {
      eventId
      userId
    }
  }
`;

// Get event by ID
export const getEvent = async (id: string): Promise<Event> => {
  const { data } = await client.query<{ getEvent: Event }>({
    query: GET_EVENT_QUERY,
    variables: { id },
    fetchPolicy: 'network-only',
  });
  
  return data.getEvent;
};

// Get event by URL
export const getEventByUrl = async (url: string): Promise<Event> => {
  const { data } = await client.query<{ getEventByUrl: Event }>({
    query: GET_EVENT_BY_URL_QUERY,
    variables: { url },
    fetchPolicy: 'network-only',
  });
  
  return data.getEventByUrl;
};

// Get all events
export const getEvents = async (): Promise<Event[]> => {
  const { data } = await client.query<{ getEvents: Event[] }>({
    query: GET_EVENTS_QUERY,
    fetchPolicy: 'network-only',
  });
  
  return data.getEvents;
};

// Get events with pagination
export const getEventsPaginated = async (
  variables: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }
): Promise<EventConnection> => {
  const { data } = await client.query<{ getEventsPaginated: EventConnection }>({
    query: GET_EVENTS_PAGINATED_QUERY,
    variables,
    fetchPolicy: 'network-only',
  });
  
  return data.getEventsPaginated;
};

// Get events created by a user
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  const { data } = await client.query<{ getUserEvents: Event[] }>({
    query: GET_USER_EVENTS_QUERY,
    variables: { userId },
    fetchPolicy: 'network-only',
  });
  
  return data.getUserEvents;
};

// Get events created by a user with pagination
export const getUserEventsPaginated = async (
  userId: string,
  variables: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }
): Promise<EventConnection> => {
  const { data } = await client.query<{ getUserEventsPaginated: EventConnection }>({
    query: GET_USER_EVENTS_PAGINATED_QUERY,
    variables: { userId, ...variables },
    fetchPolicy: 'network-only',
  });
  
  return data.getUserEventsPaginated;
};

// Get dates for an event
export const getEventDates = async (eventId: string): Promise<EventDate[]> => {
  const { data } = await client.query<{ getEventDates: EventDate[] }>({
    query: GET_EVENT_DATES_QUERY,
    variables: { eventId },
    fetchPolicy: 'network-only',
  });
  
  return data.getEventDates;
};

// Get dates for an event with pagination
export const getEventDatesPaginated = async (
  eventId: string,
  variables: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }
): Promise<EventDateConnection> => {
  const { data } = await client.query<{ getEventDatesPaginated: EventDateConnection }>({
    query: GET_EVENT_DATES_PAGINATED_QUERY,
    variables: { eventId, ...variables },
    fetchPolicy: 'network-only',
  });
  
  return data.getEventDatesPaginated;
};

// Get users participating in an event
export const getEventUsers = async (eventId: string): Promise<User[]> => {
  const { data } = await client.query<{ getEventUsers: User[] }>({
    query: GET_EVENT_USERS_QUERY,
    variables: { eventId },
    fetchPolicy: 'network-only',
  });
  
  return data.getEventUsers;
};

// Create event
export const createEvent = async (input: CreateEventInput): Promise<Event> => {
  const { data } = await client.mutate<{ createEvent: Event }>({
    mutation: CREATE_EVENT_MUTATION,
    variables: { input },
  });
  
  return data?.createEvent as Event;
};

// Update event
export const updateEvent = async (id: string, input: UpdateEventInput): Promise<Event> => {
  const { data } = await client.mutate<{ updateEvent: Event }>({
    mutation: UPDATE_EVENT_MUTATION,
    variables: { id, input },
  });
  
  return data?.updateEvent as Event;
};

// Delete event
export const deleteEvent = async (id: string): Promise<Event> => {
  const { data } = await client.mutate<{ deleteEvent: Event }>({
    mutation: DELETE_EVENT_MUTATION,
    variables: { id },
  });
  
  return data?.deleteEvent as Event;
};

// Add date to event
export const addEventDate = async (eventId: string, eventDate: string): Promise<EventDate> => {
  const { data } = await client.mutate<{ addEventDate: EventDate }>({
    mutation: ADD_EVENT_DATE_MUTATION,
    variables: { eventId, eventDate },
  });
  
  return data?.addEventDate as EventDate;
};

// Remove date from event
export const removeEventDate = async (eventId: string, eventDate: string): Promise<EventDate> => {
  const { data } = await client.mutate<{ removeEventDate: EventDate }>({
    mutation: REMOVE_EVENT_DATE_MUTATION,
    variables: { eventId, eventDate },
  });
  
  return data?.removeEventDate as EventDate;
};

// Add user to event
export const addUserToEvent = async (eventId: string, userId: string): Promise<{ eventId: string; userId: string }> => {
  const { data } = await client.mutate<{ addUserToEvent: { eventId: string; userId: string } }>({
    mutation: ADD_USER_TO_EVENT_MUTATION,
    variables: { eventId, userId },
  });
  
  return data?.addUserToEvent as { eventId: string; userId: string };
};

// Remove user from event
export const removeUserFromEvent = async (eventId: string, userId: string): Promise<{ eventId: string; userId: string }> => {
  const { data } = await client.mutate<{ removeUserFromEvent: { eventId: string; userId: string } }>({
    mutation: REMOVE_USER_FROM_EVENT_MUTATION,
    variables: { eventId, userId },
  });
  
  return data?.removeUserFromEvent as { eventId: string; userId: string };
};
