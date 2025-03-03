import { Event } from './event';
import { UserEventTime } from './time';

export interface EventDate {
  eventId: string;
  eventDate: string;
  event: Event;
  userAvailability: UserEventTime[];
}

export interface EventDateConnection {
  edges: {
    node: EventDate;
    cursor: string;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}
