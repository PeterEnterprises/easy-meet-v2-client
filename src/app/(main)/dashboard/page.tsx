"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
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
