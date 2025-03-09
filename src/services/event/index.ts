// Import event retrieval functions
import { getEvent } from './get-event';
import { getEventByUrl } from './get-event-by-url';
import { getEvents } from './get-events';
import { getEventsPaginated } from './get-events-paginated';
import { getUserEvents } from './get-user-events';
import { getUserEventsPaginated } from './get-user-events-paginated';

// Import event dates functions
import { getEventDates } from './get-event-dates';
import { getEventDatesPaginated } from './get-event-dates-paginated';
import { addEventDate } from './add-event-date';
import { removeEventDate } from './remove-event-date';

// Import event users functions
import { getEventUsers } from './get-event-users';
import { addUserToEvent } from './add-user-to-event';
import { removeUserFromEvent } from './remove-user-from-event';

// Import event CRUD functions
import { createEvent } from './create-event';
import { updateEvent } from './update-event';
import { deleteEvent } from './delete-event';

// Export individual functions
export {
  // Event retrieval
  getEvent,
  getEventByUrl,
  getEvents,
  getEventsPaginated,
  getUserEvents,
  getUserEventsPaginated,
  
  // Event dates
  getEventDates,
  getEventDatesPaginated,
  addEventDate,
  removeEventDate,
  
  // Event users
  getEventUsers,
  addUserToEvent,
  removeUserFromEvent,
  
  // Event CRUD
  createEvent,
  updateEvent,
  deleteEvent
};

export const eventService = {
  // Event retrieval
  getEvent,
  getEventByUrl,
  getEvents,
  getEventsPaginated,
  getUserEvents,
  getUserEventsPaginated,
  
  // Event dates
  getEventDates,
  getEventDatesPaginated,
  addEventDate,
  removeEventDate,
  
  // Event users
  getEventUsers,
  addUserToEvent,
  removeUserFromEvent,
  
  // Event CRUD
  createEvent,
  updateEvent,
  deleteEvent
};
