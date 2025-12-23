'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createVisionRecord, type FormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils';


const initialState: FormState = { message: null, errors: {}, success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
      Add Record
    </Button>
  );
}

export function VisionTestForm() {
  const { toast } = useToast();
  const [state, dispatch] = useFormState(createVisionRecord, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const [leftDist, setLeftDist] = useState<number | string>('');
  const [rightDist, setRightDist] = useState<number | string>('');

  const calculateDegree = (dist: number | string) => {
    const numDist = Number(dist);
    if (numDist > 0 && numDist <= 500) {
      return (100 / numDist).toFixed(2);
    }
    if (numDist > 500) return '~0 (No Myopia)';
    return '-';
  };

  useEffect(() => {
    if (state.success && state.message) {
      formRef.current?.reset();
      setLeftDist('');
      setRightDist('');
      toast({
        title: "Success",
        description: state.message,
      });
    } else if (!state.success && state.message) {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Eye className="text-primary" />
          New Vision Test
        </CardTitle>
        <CardDescription>
          Enter the furthest distance (in cm) at which you can see an object clearly. The calculated 'degree' is based on the formula: 100 / distance.
        </CardDescription>
      </CardHeader>
      <form ref={formRef} action={dispatch}>
        <CardContent className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="leftEyeDist">Left Eye Distance (cm)</Label>
            <Input
              id="leftEyeDist"
              name="leftEyeDist"
              type="number"
              placeholder="e.g., 25"
              step="0.1"
              onChange={(e) => setLeftDist(e.target.value)}
              aria-describedby="left-eye-error"
              required
            />
            <p className="text-sm text-muted-foreground">
              Calculated Degree: <span className="font-bold text-primary">{calculateDegree(leftDist)}</span>
            </p>
            {state.errors?.leftEyeDist && (
              <p id="left-eye-error" className="text-sm font-medium text-destructive">{state.errors.leftEyeDist[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rightEyeDist">Right Eye Distance (cm)</Label>
            <Input
              id="rightEyeDist"
              name="rightEyeDist"
              type="number"
              placeholder="e.g., 30"
              step="0.1"
              onChange={(e) => setRightDist(e.target.value)}
              aria-describedby="right-eye-error"
              required
            />
            <p className="text-sm text-muted-foreground">
              Calculated Degree: <span className="font-bold text-primary">{calculateDegree(rightDist)}</span>
            </p>
            {state.errors?.rightEyeDist && (
              <p id="right-eye-error" className="text-sm font-medium text-destructive">{state.errors.rightEyeDist[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
