import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
}

/**
 * Custom hook for API calls with loading and error states
 */
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<any>,
  options: UseApiOptions = { immediate: false }
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await apiFunction(...args);
        setState({ data: response.data || response, loading: false, error: null });
        return response;
      } catch (err: any) {
        const errorMessage = err.message || 'An error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        throw err;
      }
    },
    [apiFunction]
  );

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Custom hook for fetching data on component mount
 */
export function useFetch<T>(
  apiFunction: () => Promise<any>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction();
      setState({ data: response.data || response, loading: false, error: null });
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [apiFunction]);

  useEffect(() => {
    refetch();
  }, dependencies);

  return {
    ...state,
    refetch,
  };
}

/**
 * Custom hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<T>(
  apiFunction: (...args: any[]) => Promise<any>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (...args: any[]) => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await apiFunction(...args);
        setState({ data: response.data || response, loading: false, error: null });
        return response;
      } catch (err: any) {
        const errorMessage = err.message || 'An error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        throw err;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}