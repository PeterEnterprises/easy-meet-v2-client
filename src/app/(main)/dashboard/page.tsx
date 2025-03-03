"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isPageReady, setIsPageReady] = useState(false);

  // Simplified effect to just handle page readiness
  useEffect(() => {
    console.log('Dashboard page mounted, user state:', { 
      loading, 
      hasUser: !!user 
    });
    
    // Only set page as ready when loading is complete and we have user data
    if (!loading && user) {
      console.log('User data loaded, setting page as ready');
      setIsPageReady(true);
    }
  }, [loading, user]);

  // Show loading state
  if (loading || !isPageReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // Safety check - if somehow we get here without a user, show empty state
  // We don't redirect here since middleware and layout already handle auth redirects
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">No user data available</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.userName}!</CardTitle>
            <CardDescription>Your personal dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is your EZ Meet dashboard where you can manage your meetings and availability.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/events/new")}>
              Create New Event
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Events</CardTitle>
            <CardDescription>Events you&apos;ve created</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You haven&apos;t created any events yet.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/events")}>
              View All Events
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invitations</CardTitle>
            <CardDescription>Events you&apos;ve been invited to</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You don&apos;t have any invitations.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              View Invitations
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
