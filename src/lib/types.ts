import { Timestamp } from 'firebase/firestore';

export type VisionRecord = {
  id: string;
  leftEyeDistanceCm: number;
  rightEyeDistanceCm: number;
  leftEyeDegree: number;
  rightEyeDegree: number;
  chartLine: number;
  notes?: string;
  testedAt: Date | Timestamp;
};

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};
