'use client';

import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { createVisionRecord, type FormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useUser } from '@/firebase';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SubmitButton } from '../SubmitButton';


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

const initialState: FormState = { message: null, errors: {}, success: false };

export function VisionTestForm() {
  const { user } = useUser();
  const userId = user?.uid;
  const { toast } = useToast();
  
  const createVisionRecordWithUserId = userId ? createVisionRecord.bind(null, userId) : null;
  const [state, formAction] = useFormState(createVisionRecordWithUserId || (async () => initialState), initialState);
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success",
        description: state.message,
      });
      formRef.current?.reset();
      // Manually clear controlled components if reset() doesn't suffice for them in some React versions
      // This part can be removed if formRef.current.reset() works fine.
    } else if (state.message && (state.errors && Object.keys(state.errors).length > 0)) {
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
      <form ref={formRef} action={formAction}>
        <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="leftEyeDist">Left Eye (cm)</Label>
                        <Input
                            id="leftEyeDist"
                            name="leftEyeDist"
                            type="number"
                            placeholder="e.g., 25"
                            step="0.1"
                            aria-describedby="left-eye-error"
                            required
                        />
                        {state.errors?.leftEyeDist && <p id="left-eye-error" className="text-sm font-medium text-destructive">{state.errors.leftEyeDist[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rightEyeDist">Right Eye (cm)</Label>
                        <Input
                            id="rightEyeDist"
                            name="rightEyeDist"
                            type="number"
                            placeholder="e.g., 30"
                            step="0.1"
                            aria-describedby="right-eye-error"
                            required
                        />
                         {state.errors?.rightEyeDist && <p id="right-eye-error" className="text-sm font-medium text-destructive">{state.errors.rightEyeDist[0]}</p>}
                    </div>
                 </div>
                <div className="space-y-2">
                    <Label htmlFor="chartLine">Chart Line Used</Label>
                    <Select name="chartLine" required defaultValue="8">
                        <SelectTrigger id="chartLine" aria-describedby="chart-line-error">
                            <SelectValue placeholder="Select a line" />
                        </SelectTrigger>
                        <SelectContent>
                            {[...Array(10)].map((_, i) => (
                                <SelectItem key={i+1} value={(i+1).toString()}>Line {i+1}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     {state.errors?.chartLine && <p id="chart-line-error" className="text-sm font-medium text-destructive">{state.errors.chartLine[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Any comments, e.g., 'feeling tired', 'with new glasses'"
                        aria-describedby="notes-error"
                    />
                    {state.errors?.notes && <p id="notes-error" className="text-sm font-medium text-destructive">{state.errors.notes[0]}</p>}
                </div>
            </div>
            <EyeChart />
        </CardContent>
        <CardFooter>
          <SubmitButton icon={<PlusCircle/>} text="Add Record" />
        </CardFooter>
      </form>
    </Card>
  );
}