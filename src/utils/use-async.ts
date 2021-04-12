import { useCallback, useState } from 'react';

export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

export interface AsyncFunction<F, V> {
    execute: F;
    status: AsyncStatus;
    value: V | null;
    error: any;
}

export const useAsync = <F extends (...args: A) => Promise<R>, A extends any[], R>(asyncFunction: F): AsyncFunction<(...args: A) => Promise<void>, R> => {
    const [status, setStatus] = useState<AsyncStatus>('idle');
    const [value, setValue] = useState<R | null>(null);
    const [error, setError] = useState<any>(null);

    // The execute function wraps asyncFunction and
    // handles setting state for pending, value, and error.
    // useCallback ensures the below useEffect is not called
    // on every render, but only if asyncFunction changes.
    const execute = useCallback((...args: A) => {
        setStatus('pending');
        setValue(null);
        setError(null);
        return asyncFunction(...args)
            .then((response) => {
                setValue(response);
                setStatus('success');
            })
            .catch((error) => {
                setError(error);
                setStatus('error');
            });
    }, [asyncFunction]);

    return { execute, status, value, error };
};