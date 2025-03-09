import { gql } from '@apollo/client';

export const USER_AVAILABILITY_UPDATED_SUBSCRIPTION = gql`
  subscription UserAvailabilityUpdated($eventId: ID!, $eventDate: DateTime) {
    userAvailabilityUpdated(eventId: $eventId, eventDate: $eventDate) {
      userId
      eventId
      eventDate
      user {
        userName
      }
      openTime {
        hours
      }
      closedTime {
        hours
      }
    }
  }
`;
