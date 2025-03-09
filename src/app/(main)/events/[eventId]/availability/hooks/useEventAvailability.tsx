"use client";

import { useState, useEffect } from 'react';
import { getEventAvailability, USER_AVAILABILITY_UPDATED_SUBSCRIPTION } from '@/services/time';
import { client } from '@/services/apollo-client';
import { UserEventTime } from '@/types/time';

export function useEventAvailability(eventId: string, eventDate: string) {
  const [availabilityData, setAvailabilityData] = useState<UserEventTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getEventAvailability(eventId, eventDate);
        setAvailabilityData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    if (eventId && eventDate) {
      fetchData();
    }
  }, [eventId, eventDate]);

  // Set up subscription
  useEffect(() => {
    if (!eventId || !eventDate) return;

    const subscription = client
      .subscribe({
        query: USER_AVAILABILITY_UPDATED_SUBSCRIPTION,
        variables: { eventId, eventDate },
      })
      .subscribe({
        next({ data }) {
          if (data?.userAvailabilityUpdated) {
            const updatedUserData = data.userAvailabilityUpdated;
            
            // Update the state with the new data
            setAvailabilityData(prevData => {
              // Find if this user already exists in our data
              const userIndex = prevData.findIndex(
                item => item.userId === updatedUserData.userId
              );
              
              if (userIndex >= 0) {
                // Update existing user
                const newData = [...prevData];
                newData[userIndex] = {
                  ...newData[userIndex],
                  openTime: updatedUserData.openTime,
                  closedTime: updatedUserData.closedTime
                };
                return newData;
              } else {
                // Add new user
                return [...prevData, updatedUserData];
              }
            });
          }
        },
        error(err) {
          console.error('Subscription error:', err);
          setError(err);
        },
      });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [eventId, eventDate]);

  return { availabilityData, loading, error };
}
