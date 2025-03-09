"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types";
import { getUserEvents } from "../../../services/event/get-user-events";

export default function EventsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (user) {
        try {
          setLoadingEvents(true);
          const userEvents = await getUserEvents(user.id);
          setEvents(userEvents);
        } catch (error) {
          console.error("Error fetching events:", error);
        } finally {
          setLoadingEvents(false);
        }
      }
    };

    if (user) {
      fetchEvents();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Events</h1>
        <Button onClick={() => router.push("/events/new")}>Create New Event</Button>
      </div>

      {loadingEvents ? (
        <div className="flex justify-center py-10">
          <p>Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Events Found</CardTitle>
            <CardDescription>You haven&apos;t created any events yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create your first event to start scheduling meetings with others.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/events/new")}>
              Create Your First Event
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="truncate">{event.name}</CardTitle>
                <CardDescription>
                  {event.eventDates.length} date{event.eventDates.length !== 1 ? "s" : ""} •{" "}
                  {event.participants.length} participant{event.participants.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share URL: <span className="font-mono">{event.url}</span>
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => router.push(`/events/${event.id}`)}>
                  View Details
                </Button>
                <Button size="sm" onClick={() => router.push(`/events/${event.id}/edit`)}>
                  Manage
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
