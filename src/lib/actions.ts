'use server';

import { z } from 'zod';
import { addRecord, updateRecord, deleteRecord } from './data';
import { revalidatePath } from 'next/cache';
import { Timestamp } from 'firebase-admin/firestore';
import { redirect } from 'next/navigation';

const VisionTestSchema = z.object({
  leftEyeDist: z.coerce.number().positive({ message: 'Distance must be a positive number.' }).max(500, { message: 'Distance seems too large for this estimation method.'}),
  rightEyeDist: z.coerce.number().positive({ message: 'Distance must be a positive number.' }).max(500, { message: 'Distance seems too large for this estimation method.'}),
  chartLine: z.coerce.number().min(1).max(10),
  notes: z.string().optional(),
});

export type FormState = {
    errors?: {
        leftEyeDist?: string[];
        rightEyeDist?: string[];
        chartLine?: string[];
        notes?: string[];
    };
    message?: string | null;
    success?: boolean;
};

export async function createVisionRecord(userId: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = VisionTestSchema.safeParse({
        leftEyeDist: formData.get('leftEyeDist'),
        rightEyeDist: formData.get('rightEyeDist'),
        chartLine: formData.get('chartLine'),
        notes: formData.get('notes'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid input. Please check the data entered.',
            success: false,
        };
    }

    const { leftEyeDist, rightEyeDist, chartLine, notes } = validatedFields.data;

    const leftEyeDegree = 100 / leftEyeDist;
    const rightEyeDegree = 100 / rightEyeDist;

    try {
        const newRecord = {
          leftEyeDistanceCm: leftEyeDist,
          rightEyeDistanceCm: rightEyeDist,
          leftEyeDegree: leftEyeDegree,
          rightEyeDegree: rightEyeDegree,
          chartLine: chartLine,
          notes: notes || '',
          testedAt: Timestamp.now(),
        };
        await addRecord(userId, newRecord);
    } catch (error: any) {
        console.error("Firebase Admin Error:", error);
        return {
            message: error.message || 'Database Error: Failed to create record.',
            success: false,
        };
    }

    revalidatePath('/');
    return { 
        message: 'Successfully added new vision record.',
        success: true,
        errors: {},
    };
}


export async function updateVisionRecord(id: string, userId: string, prevState: FormState, formData: FormData) {
  const validatedFields = VisionTestSchema.safeParse({
    leftEyeDist: formData.get('leftEyeDist'),
    rightEyeDist: formData.get('rightEyeDist'),
    chartLine: formData.get('chartLine'),
    notes: formData.get('notes'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid input. Please check the data entered.',
    };
  }
 
  const { leftEyeDist, rightEyeDist, chartLine, notes } = validatedFields.data;
  const leftEyeDegree = 100 / leftEyeDist;
  const rightEyeDegree = 100 / rightEyeDist;
 
  try {
    await updateRecord(userId, id, {
      leftEyeDistanceCm: leftEyeDist,
      rightEyeDistanceCm: rightEyeDist,
      leftEyeDegree,
      rightEyeDegree,
      chartLine,
      notes: notes || '',
    });
  } catch (error) {
    return { message: 'Database Error: Failed to Update Record.' };
  }
 
  revalidatePath('/');
  redirect('/');
}


export async function deleteVisionRecord(id: string, userId: string) {
  try {
    await deleteRecord(userId, id);
    revalidatePath('/');
    return { message: 'Deleted Record.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Record.' };
  }
}