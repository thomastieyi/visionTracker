import { getRecords } from '@/lib/data';
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

export async function HistoryTable() {
  const records = await getRecords();
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
              {records.length > 0 ? (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {format(record.measuredAt, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">{record.leftEyeDist.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{record.rightEyeDist.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {record.leftEyeDegree.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {record.rightEyeDegree.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
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
