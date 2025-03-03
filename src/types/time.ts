import { User } from './user';
import { Event } from './event';

export enum Role {
  User = 'User',
  Admin = 'Admin',
}

export interface Time {
  id: string;
  role: Role;
  date: string;
  hours: boolean[];
}

export interface TimeInput {
  role: Role;
  date: string;
  hours: boolean[];
}

export interface UserEventTime {
  userId: string;
  eventId: string;
  eventDate: string;
  user: User;
  event: Event;
  openTime?: Time;
  closedTime?: Time;
}

export interface UserEventTimeConnection {
  edges: {
    node: UserEventTime;
    cursor: string;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}
