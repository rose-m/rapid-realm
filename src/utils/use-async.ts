import { useCallback, useState } from 'react';

export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

export interface AsyncFunction<F, V> {
  execute: F;
  status: AsyncStatus;
  value: V | null;
  error: any;
  reset: () => void;
}

export const useAsync = <
  A extends any[],
  F extends (...args: A) => Promise<any>,
  R = F extends (...args: A) => Promise<infer R> ? R : any
>(
  asyncFunction: F
): AsyncFunction<
  (...args: A) => Promise<void>,
  R
> => {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [value, setValue] = useState<R | null>(null);
  const [error, setError] = useState<any>(null);
  const reset = () => {
    setStatus('idle');
    setValue(null);
    setError(null);
  };

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(async (...args: A) => {
    setStatus('pending');
    setValue(null);
    setError(null);
    try {
      const response = await asyncFunction(...args);
      setValue(response);
      setStatus('success');
    } catch (error) {
      setError(error);
      setStatus('error');
    }
  }, [asyncFunction]);

  return { execute, status, value, error, reset };
};