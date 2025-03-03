import { Event } from './event';
import { EventUser } from './event-user';
import { UserEventTime } from './time';

export interface User {
  id: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  createdEvents?: Event[];
  eventParticipation?: EventUser[];
  availability?: UserEventTime[];
}

export interface UserConnection {
  edges: {
    node: User;
    cursor: string;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export interface UpdateUserInput {
  userName?: string;
  email?: string;
  password?: string;
}
