'use client';

import { useState, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createVisionRecord, type FormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useUser } from '@/firebase';
import { Separator } from '../ui/separator';

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

function EyeChart() {
    const chartLines = [
        { text: 'E', size: 'text-5xl', weight: 'font-bold' },
        { text: 'FP', size: 'text-4xl', weight: 'font-bold' },
        { text: 'TOZ', size: 'text-3xl', weight: 'font-bold' },
        { text: 'LPED', size: 'text-2xl', weight: 'font-semibold' },
        { text: 'PECFD', size: 'text-xl', weight: 'font-semibold' },
        { text: 'EDFCZP', size: 'text-lg', weight: 'font-medium' },
        { text: 'FELOPZD', size: 'text-base', weight: 'font-medium' },
        { text: 'DEFPOTEC', size: 'text-sm', weight: 'font-normal' },
        { text: 'LEFODPCT', size: 'text-xs', weight: 'font-normal' },
        { text: 'TCEHYIUR', size: 'text-[10px]', weight: 'font-normal' },
    ];
    return (
        <div className="flex flex-col items-center justify-center p-4 border-dashed border-2 rounded-lg h-full space-y-3 bg-secondary/50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12 mb-2">
                <path d="M80 20H20v15h45v10H20v10h45v10H20v10h45v15H20V20z" />
            </svg>
            <div className="w-full space-y-1.5 flex-grow flex flex-col justify-center">
                {chartLines.map((line, index) => (
                    <div key={index} className="flex items-center gap-4 w-full">
                        <span className="text-xs w-5 text-right text-muted-foreground font-mono">{index + 1}</span>
                        <div className="flex-1 text-center tracking-widest">
                            <p className={`${line.size} ${line.weight}`}>{line.text}</p>
                        </div>
                        <span className="text-xs w-5"></span>
                    </div>
                ))}
            </div>
            <Separator className="my-2" />
            <p className="text-xs text-muted-foreground text-center">将手机移近或移远，直到某行文字变得清晰。</p>
        </div>
    )
}

export function VisionTestForm() {
  const { user } = useUser();
  const userId = user?.uid;
  const { toast } = useToast();
  
  const createVisionRecordWithUserId = userId ? createVisionRecord.bind(null, userId) : null;
  
  const [state, dispatch] = useActionState(createVisionRecordWithUserId || (async () => initialState), initialState);
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
    if (state.success) {
        if(state.message) {
            toast({
                title: "Success",
                description: state.message,
            });
        }
      formRef.current?.reset();
      setLeftDist('');
      setRightDist('');
    } else if (state.message) {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        });
    }
  }, [state, toast]);
  
  if (!createVisionRecordWithUserId) {
    return null;
  }

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
        <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
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
            </div>
            <EyeChart />
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
