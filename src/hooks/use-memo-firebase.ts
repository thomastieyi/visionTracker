'use client';
import { useMemo } from 'react';
import { isEqual } from 'lodash-es';

// Custom hook to memoize Firebase queries
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, useDeepCompareMemoize(deps));
}

function useDeepCompareMemoize(value: any[]) {
  const ref = React.useRef<any[]>([]);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}
