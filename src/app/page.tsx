'use client';
import { VisionTestForm } from '@/components/vision/VisionTestForm';
import { HistoryTable } from '@/components/vision/HistoryTable';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

function HistoryTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-sm" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-48 w-full" />
      </CardContent>
    </Card>
  );
}

function WelcomeMessage() {
  return (
    <div className="text-center py-16">
      <h2 className="text-3xl font-bold mb-4">Welcome to VisionTrack</h2>
      <p className="text-muted-foreground mb-8">
        Your personal tool for vision self-assessment and tracking.
        <br />
        Please log in to save your results and track your progress.
      </p>
      <Button asChild>
        <Link href="/login">
          Log In <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export default function Home() {
  const { user, isUserLoading: isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Skeleton className="h-96 w-full" />
          <HistoryTableSkeleton />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <WelcomeMessage />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <VisionTestForm userId={user.uid} />
        <Suspense fallback={<HistoryTableSkeleton />}>
          <HistoryTable userId={user.uid} />
        </Suspense>
      </div>
    </div>
  );
}
