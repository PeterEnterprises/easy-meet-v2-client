import { User } from './user';
import { EventDate } from './event-date';
import { EventUser } from './event-user';
import { Time, UserEventTime } from './time';

export interface Event {
  id: string;
  name: string;
  url: string;
  eventMaker: string;
  creator: User;
  usersCanCloseTime: boolean;
  masterClosedTime?: Time;
  eventDates: EventDate[];
  participants: EventUser[];
  userAvailability: UserEventTime[];
}

export interface EventConnection {
  edges: {
    node: Event;
    cursor: string;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export interface CreateEventInput {
  name: string;
  usersCanCloseTime?: boolean;
}

export interface UpdateEventInput {
  name?: string;
  usersCanCloseTime?: boolean;
}
