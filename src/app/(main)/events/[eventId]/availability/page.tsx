"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { getEvent, getEventDates } from '@/services';
import { Event, EventDate } from '@/types';
import { useEventAvailability } from './hooks/useEventAvailability';
import AvailabilityTable from './components/AvailabilityTable';
import { Button } from '@/components/ui/button';

export default function EventAvailabilityPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [eventDates, setEventDates] = useState<EventDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch event and dates
  useEffect(() => {
    async function fetchEventData() {
      if (!eventId || typeof eventId !== 'string') return;
      
      try {
        setLoading(true);
        const eventData = await getEvent(eventId as string);
        setEvent(eventData);
        
        const dates = await getEventDates(eventId as string);
        setEventDates(dates);
        
        // Set the first date as selected by default
        if (dates.length > 0 && !selectedDate) {
          setSelectedDate(dates[0].eventDate);
        }
      } catch (err) {
        console.error('Error fetching event data:', err);
        setError('Failed to load event data');
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated && !authLoading) {
      fetchEventData();
    }
  }, [eventId, isAuthenticated, authLoading, selectedDate]);

  // Get availability data with subscription
  const { 
    availabilityData, 
    loading: availabilityLoading, 
    error: availabilityError 
  } = useEventAvailability(
    typeof eventId === 'string' ? eventId : '', 
    selectedDate
  );

  if (authLoading) {
    return <div className="p-8 text-center">Authenticating...</div>;
  }

  if (!isAuthenticated) {
    return <div className="p-8 text-center">Please log in to view this page</div>;
  }

  if (loading) {
    return <div className="p-8 text-center">Loading event data...</div>;
  }

  if (error || !event) {
    return <div className="p-8 text-center text-red-500">{error || 'Event not found'}</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{event.name} - Availability</h1>
        <Button variant="outline" onClick={() => router.push(`/events/${eventId}`)}>
          Back to Event
        </Button>
      </div>
      
      {/* Date selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date:
        </label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="block w-full max-w-xs rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          {eventDates.map((date) => (
            <option key={`${date.eventId}-${date.eventDate}`} value={date.eventDate}>
              {new Date(date.eventDate).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {availabilityLoading ? (
        <div className="p-8 text-center">Loading availability data...</div>
      ) : availabilityError ? (
        <div className="p-8 text-center text-red-500">
          Error loading availability data
        </div>
      ) : availabilityData.length === 0 ? (
        <div className="p-8 text-center">
          No availability data found for this date
        </div>
      ) : (
        <AvailabilityTable availabilityData={availabilityData} />
      )}
    </div>
  );
}
