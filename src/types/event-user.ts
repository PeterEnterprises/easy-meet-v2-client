import { Event } from './event';
import { User } from './user';

export interface EventUser {
  eventId: string;
  userId: string;
  event: Event;
  user: User;
}
