import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { waitForMinimumLoadingDuration } from '../utils/loading';

type ApiRequest<T> = (signal?: AbortSignal) => Promise<T>;

function getRequestErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return 'Something went wrong while loading the data. Please try again.';
  }

  if (!error.response) {
    return 'The service could not be reached. Check your connection and try again.';
  }

  if (error.response.status === 401) {
    return 'Your session has expired. Please sign in again.';
  }

  if (error.response.status === 403) {
    return 'You do not have permission to view this data.';
  }

  return 'The data could not be loaded. Please try again.';
}

export function useApiRequest<T>(request: ApiRequest<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const startedAt = Date.now();

    setData(null);
    setLoading(true);
    setError(null);

    async function executeRequest() {
      try {
        const response = await request(controller.signal);
        await waitForMinimumLoadingDuration(startedAt);
        if (!controller.signal.aborted) setData(response);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          await waitForMinimumLoadingDuration(startedAt);
          setError(getRequestErrorMessage(requestError));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    executeRequest();
    return () => controller.abort();
  }, [request, requestVersion]);

  return { data, loading, error, retry };
}
