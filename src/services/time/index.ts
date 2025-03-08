// Import user availability functions
import { getUserAvailability } from './get-user-availability';
import { setUserAvailability } from './set-user-availability';
import { setUserUnavailability } from './set-user-unavailability';

// Import event availability functions
import { getEventAvailability } from './get-event-availability';
import { getEventAvailabilityPaginated } from './get-event-availability-paginated';

// Import time management functions
import { createTime } from './create-time';
import { setMasterClosedTime } from './set-master-closed-time';

export const timeService = {
  // User availability
  getUserAvailability,
  setUserAvailability,
  setUserUnavailability,
  
  // Event availability
  getEventAvailability,
  getEventAvailabilityPaginated,
  
  // Time management
  createTime,
  setMasterClosedTime
};
