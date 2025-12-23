import { VisionTestForm } from '@/components/vision/VisionTestForm';
import { HistoryTable } from '@/components/vision/HistoryTable';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <VisionTestForm />
        <Suspense fallback={<HistoryTableSkeleton />}>
          <HistoryTable />
        </Suspense>
      </div>
    </div>
  );
}
