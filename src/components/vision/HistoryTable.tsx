'use client';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { History } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase';

export function HistoryTable() {
  const firestore = useFirestore();
  const { user } = useUser();
  const userId = user?.uid;

  const recordsQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    // NOTE: The collection is 'visionTestResults' not 'records'
    return query(
      collection(firestore, 'users', userId, 'visionTestResults'),
      orderBy('testedAt', 'desc'),
      limit(20)
    );
  }, [firestore, userId]);

  const { data: records, isLoading } = useCollection(recordsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <History className="text-primary" />
          Test History
        </CardTitle>
        <CardDescription>
          A chronological log of your past vision test results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] min-w-[120px]">Date</TableHead>
                <TableHead className="text-right">Left Eye (cm)</TableHead>
                <TableHead className="text-right">Right Eye (cm)</TableHead>
                <TableHead className="text-right">Left Degree</TableHead>
                <TableHead className="text-right">Right Degree</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    Loading history...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && records && records.length > 0 ? (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {format(record.testedAt.toDate(), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">{record.leftEyeDistanceCm.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{record.rightEyeDistanceCm.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {record.leftEyeDegree.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {record.rightEyeDegree.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : null}
              {!isLoading && (!records || records.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No records yet. Take your first test!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
