"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { getEvent, getEventDates } from '@/services';
import { Event, EventDate } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useEventAvailability } from './availability/hooks/useEventAvailability';
import AvailabilityTable from './availability/components/AvailabilityTable';

export default function EventDetailPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [eventDates, setEventDates] = useState<EventDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch event data
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
  console.log('testing: ', eventId, selectedDate, availabilityData, availabilityLoading, availabilityError);
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

  const isCreator = user && event.creator && user.id === event.creator.id;

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{event.name}</h1>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => router.push('/events')}
          >
            Back to Events
          </Button>
          {isCreator && (
            <Button 
              onClick={() => router.push(`/events/${eventId}/edit`)}
            >
              Edit Event
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Event Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Basic information about this event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Event URL</p>
              <p className="text-sm font-mono break-all">{event.url}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Created by</p>
              <p className="text-sm">{event.creator?.userName || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Settings</p>
              <p className="text-sm">
                {event.usersCanCloseTime 
                  ? 'Participants can mark unavailable times' 
                  : 'Only the creator can mark unavailable times'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dates Card */}
        <Card>
          <CardHeader>
            <CardTitle>Event Dates</CardTitle>
            <CardDescription>
              {eventDates.length} date{eventDates.length !== 1 ? 's' : ''} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {eventDates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No dates have been added yet.</p>
            ) : (
              <ul className="space-y-2">
                {eventDates.map((date) => (
                  <li key={date.eventDate} className="text-sm">
                    {format(new Date(date.eventDate), 'EEEE, MMMM d, yyyy')}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          {isCreator && (
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/events/${eventId}/edit`)}
              >
                Manage Dates
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Participants Card */}
        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <CardDescription>
              {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {event.participants.length === 0 ? (
              <p className="text-sm text-muted-foreground">No participants have joined yet.</p>
            ) : (
              <ul className="space-y-2">
                {event.participants.map((participant) => (
                  <li key={participant.userId} className="text-sm">
                    {participant.user?.userName || 'Unknown user'}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          {isCreator && (
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/events/${eventId}/edit`)}
              >
                Manage Participants
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Availability Section */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Availability</h2>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/events/${eventId}/availability`)}
            >
              Full Availability View
            </Button>
          </div>
          
          {/* Date selector */}
          {eventDates.length > 0 && (
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
          )}

          {eventDates.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No dates have been added to this event yet.</p>
              {isCreator && (
                <Button 
                  className="mt-4"
                  onClick={() => router.push(`/events/${eventId}/edit`)}
                >
                  Add Dates
                </Button>
              )}
            </div>
          ) : availabilityLoading ? (
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
      </div>
    </div>
  );
}
