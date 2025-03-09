// Import services
import { client, resetApolloStore } from './apollo-client';
import { authService } from './auth';
import { userService } from './user';
import { eventService } from './event';
import { timeService } from './time';

// Import specific functions from event service
import { getEvent, getEventDates } from './event';

// Export Apollo client
export { client, resetApolloStore };

// Export service objects
export {
  authService,
  userService,
  eventService,
  timeService
};

// Export specific functions
export {
  getEvent,
  getEventDates
};
