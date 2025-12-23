import { Timestamp } from 'firebase/firestore';

export type VisionRecord = {
  id: string;
  leftEyeDist: number;
  rightEyeDist: number;
  leftEyeDegree: number;
  rightEyeDegree: number;
  measuredAt: Date | Timestamp;
};

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};
