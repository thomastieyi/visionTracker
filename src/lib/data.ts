import type { VisionRecord } from './types';

// In a real application, this would be a database.
// For this demo, we use an in-memory array.
const records: VisionRecord[] = [
    {
        id: '1',
        leftEyeDist: 20,
        rightEyeDist: 25,
        leftEyeDegree: 5,
        rightEyeDegree: 4,
        measuredAt: new Date('2024-05-01T10:00:00Z'),
    },
    {
        id: '2',
        leftEyeDist: 22,
        rightEyeDist: 26,
        leftEyeDegree: 4.55,
        rightEyeDegree: 3.85,
        measuredAt: new Date('2024-06-15T11:30:00Z'),
    },
    {
        id: '3',
        leftEyeDist: 25,
        rightEyeDist: 28,
        leftEyeDegree: 4,
        rightEyeDegree: 3.57,
        measuredAt: new Date('2024-07-20T09:00:00Z'),
    },
];

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getRecords(): Promise<VisionRecord[]> {
  await delay(100);
  // Return records sorted by date, newest first
  return [...records].sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime());
}

export async function addRecord(data: Omit<VisionRecord, 'id' | 'measuredAt'>): Promise<VisionRecord> {
  await delay(100);
  const newRecord: VisionRecord = {
    ...data,
    id: crypto.randomUUID(),
    measuredAt: new Date(),
  };
  records.unshift(newRecord); // Add to the beginning
  return newRecord;
}
