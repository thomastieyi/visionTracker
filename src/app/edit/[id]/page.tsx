'use client';
import { useActionState } from 'react';
import { updateVisionRecord, type FormState } from '@/lib/actions';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { SubmitButton } from '@/components/SubmitButton';

const initialState: FormState = {
  message: '',
  errors: {},
};

function EditFormSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>
    )
}

export default function EditRecordPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { user } = useUser();
  const userId = user?.uid;
  const firestore = useFirestore();

  const recordRef = useMemoFirebase(() => {
    if (!firestore || !userId || !id) return null;
    return doc(firestore, 'users', userId, 'visionTestResults', id);
  }, [firestore, userId, id]);

  const { data: record, isLoading } = useDoc(recordRef);

  const updateRecordWithIds = updateVisionRecord.bind(null, id, userId || '');
  const [state, dispatch] = useActionState(updateRecordWithIds, initialState);

  if (isLoading || !userId) {
    return (
        <div className="container mx-auto px-4 py-8">
            <EditFormSkeleton />
        </div>
    )
  }

  if (!record) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Record not found or you do not have permission to view it.</p>
        <Button asChild variant="link">
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form action={dispatch}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Vision Record</CardTitle>
            <CardDescription>
              Update the details for this vision test entry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leftEyeDist">Left Eye (cm)</Label>
                <Input
                  id="leftEyeDist"
                  name="leftEyeDist"
                  type="number"
                  step="0.1"
                  defaultValue={record.leftEyeDistanceCm}
                  required
                />
                {state.errors?.leftEyeDist && (
                  <p className="text-sm font-medium text-destructive">
                    {state.errors.leftEyeDist[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rightEyeDist">Right Eye (cm)</Label>
                <Input
                  id="rightEyeDist"
                  name="rightEyeDist"
                  type="number"
                  step="0.1"
                  defaultValue={record.rightEyeDistanceCm}
                  required
                />
                {state.errors?.rightEyeDist && (
                  <p className="text-sm font-medium text-destructive">
                    {state.errors.rightEyeDist[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chartLine">Chart Line Used</Label>
              <Select name="chartLine" defaultValue={record.chartLine.toString()} required>
                <SelectTrigger id="chartLine">
                  <SelectValue placeholder="Select a line" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Line {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               {state.errors?.chartLine && <p className="text-sm font-medium text-destructive">{state.errors.chartLine[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any comments..."
                defaultValue={record.notes}
              />
               {state.errors?.notes && <p className="text-sm font-medium text-destructive">{state.errors.notes[0]}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                </Link>
            </Button>
            <SubmitButton icon={<Save />} text="Save Changes" />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
