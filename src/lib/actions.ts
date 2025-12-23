'use server';

import { z } from 'zod';
import { addRecord } from './data';
import { revalidatePath } from 'next/cache';
import { Timestamp } from 'firebase-admin/firestore';

const VisionTestSchema = z.object({
  leftEyeDist: z.coerce.number().positive({ message: 'Distance must be a positive number.' }).max(500, { message: 'Distance seems too large for this estimation method.'}),
  rightEyeDist: z.coerce.number().positive({ message: 'Distance must be a positive number.' }).max(500, { message: 'Distance seems too large for this estimation method.'}),
});

export type FormState = {
    errors?: {
        leftEyeDist?: string[];
        rightEyeDist?: string[];
    };
    message?: string | null;
    success?: boolean;
};

export async function createVisionRecord(userId: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = VisionTestSchema.safeParse({
        leftEyeDist: formData.get('leftEyeDist'),
        rightEyeDist: formData.get('rightEyeDist'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid input. Please check the distances entered.',
            success: false,
        };
    }

    const { leftEyeDist, rightEyeDist } = validatedFields.data;

    const leftEyeDegree = 100 / leftEyeDist;
    const rightEyeDegree = 100 / rightEyeDist;

    try {
        const newRecord = {
          userId,
          leftEyeDistanceCm: leftEyeDist,
          rightEyeDistanceCm: rightEyeDist,
          leftEyeDegree: leftEyeDegree,
          rightEyeDegree: rightEyeDegree,
          testedAt: Timestamp.now(),
        };
        await addRecord(userId, newRecord);
    } catch (error) {
        console.error("Firebase Admin Error:", error);
        return {
            message: 'Database Error: Failed to create record.',
            success: false,
        };
    }

    revalidatePath('/');
    return { 
        message: 'Successfully added new vision record.',
        success: true,
    };
}
