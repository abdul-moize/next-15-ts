import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import debounce from 'lodash/debounce';
import { PaginatedResponse } from '../utils/types';
import makeRequest from '../utils/request';

export const INITIAL_PAGINATED_RESPONSE: PaginatedResponse = {
  count: 0,
  limit: 5,
  q: '',
  results: [],
  skip: 0,
};

export const usePagination = <T = any>({
  apiUrl,
  params = {},
  fetchOnMount = true,
  initialLoadingState = false,
  limit = 10,
}: {
  apiUrl: string;
  fetchOnMount?: boolean;
  initialLoadingState?: boolean;
  limit?: number;
  params?: object;
  usePagination?: boolean;
}) => {
  const [loadingData, setLoadingData] = useState(
    fetchOnMount || initialLoadingState,
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [response, setResponse] = useState<PaginatedResponse<T>>(
    INITIAL_PAGINATED_RESPONSE,
  );
  const [refreshing, setRefreshing] = useState(false);

  const { results: data, count, skip } = response;

  const hasMore = limit === count;
  const showEmptyState = !data.length && !loadingData;

  const lastParamsRef = useRef(params);

  const fetchData = async (url: string, queryParams: object, newSkip = 0) => {
    setLoadingData(true);
    const res = await makeRequest<PaginatedResponse<T>>({
      queryParams: { ...queryParams, limit, skip: newSkip },
      url,
    });
    setLoadingData(false);

    if (res.success && res.data) {
      setResponse({ ...res.data, results: [...data, ...res.data.results] });
    }
  };

  const loadMore = async () => {
    if (loadingData || loadingMore || count < limit) return;
    setLoadingMore(true);
    await fetchData(apiUrl, params, skip + limit);
    setLoadingMore(false);
  };

  const onSearch = useCallback(debounce(fetchData, 500, { leading: true }), []);

  useEffect(() => {
    if (!lastParamsRef.current || Object.keys(params).length === 0) return;

    let isDifferent = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(params)) {
      if (
        params[key as keyof typeof params]
        !== lastParamsRef.current[key as keyof typeof params]
      ) {
        isDifferent = true;
        break;
      }
    }

    if (isDifferent) {
      onSearch(apiUrl, params);
      lastParamsRef.current = params;
    }
  }, [params]);

  useEffect(() => {
    if (fetchOnMount) fetchData(apiUrl, params);
  }, [apiUrl]);

  return {
    count,
    data,
    fetchData,
    hasMore,
    limit,
    loadMore,
    loadingData,
    loadingMore,
    onRefresh: async () => {
      setRefreshing(true);
      await fetchData(apiUrl, params);
      setRefreshing(false);
    },
    refreshing,
    response,
    setRefreshing,
    setResponse,
    showEmptyState,
    skip,
  };
};
