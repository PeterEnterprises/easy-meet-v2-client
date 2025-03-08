// Import services
import { client, resetApolloStore } from './apollo-client';
import { authService } from './auth';
import { userService } from './user';
import { eventService } from './event';
import { timeService } from './time';

// Export Apollo client
export { client, resetApolloStore };

// Export service objects
export {
  authService,
  userService,
  eventService,
  timeService
};
