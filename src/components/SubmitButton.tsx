'use client';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface SubmitButtonProps {
  text: string;
  icon?: ReactNode;
}

export function SubmitButton({ text, icon }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : icon}
      {text}
    </Button>
  );
}