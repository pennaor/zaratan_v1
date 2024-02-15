import { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse, Method } from 'axios';
import fetchAPI from '../utils/fetchAPI';

type FetchParams = {
  method?: Method;
  url?: string;
  payload?: any;
};

type FetchData<T> = {
  response?: any;
  error?: AxiosError<T>;
};

export type FetchResult<T> = {
  response?: AxiosResponse<T>;
  error?: AxiosError<T>
  loading: boolean;
  setFetchParams: React.Dispatch<React.SetStateAction<FetchParams>>
};

export function useFetch<T>(method: Method = 'GET', url = '', payload?: any): FetchResult<T> {
  const [fetchParams, setFetchParams] = useState<FetchParams>({ method, url, payload });
  const [fetchData, setFetchData] = useState<FetchData<T>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFetchData(undefined);
    if (!fetchParams.url || !fetchParams.method) {
      return setLoading(false);
    }

    const controller = new AbortController();
    fetchAPI(fetchParams.method, fetchParams.url, fetchParams.payload)
      .then((response) => {
        setFetchData(() => ({ response }));
      })
      .catch((error) => {
        setFetchData(() => ({ error }));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [fetchParams]);

  return {
    response: fetchData?.response, error: fetchData?.error, loading, setFetchParams,
  };
}
