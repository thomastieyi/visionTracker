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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { History, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { Button } from '../ui/button';
import { deleteVisionRecord } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

function RecordActions({ recordId, userId }: { recordId: string, userId: string }) {
  const { toast } = useToast();
  const deleteRecordWithId = async () => {
    const result = await deleteVisionRecord(recordId, userId);
    if (result.message.includes('Failed')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Record deleted successfully.",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
           <Link href={`/edit/${recordId}`}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
           </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteRecordWithId}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function HistoryTable() {
  const firestore = useFirestore();
  const { user } = useUser();
  const userId = user?.uid;

  const recordsQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
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
                <TableHead className="w-[180px] min-w-[150px]">Date</TableHead>
                <TableHead className="text-right">Left Eye (cm)</TableHead>
                <TableHead className="text-right">Right Eye (cm)</TableHead>
                <TableHead className="text-right">Left Degree</TableHead>
                <TableHead className="text-right">Right Degree</TableHead>
                <TableHead className="text-center">Line</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                 <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    Loading history...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && records && records.length > 0 ? (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {format(record.testedAt.toDate(), 'yyyy-MM-dd HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">{record.leftEyeDistanceCm.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{record.rightEyeDistanceCm.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {record.leftEyeDegree.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {record.rightEyeDegree.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">{record.chartLine || '-'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{record.notes || '-'}</TableCell>
                    <TableCell>
                      {userId && <RecordActions recordId={record.id} userId={userId} />}
                    </TableCell>
                  </TableRow>
                ))
              ) : null}
              {!isLoading && (!records || records.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
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