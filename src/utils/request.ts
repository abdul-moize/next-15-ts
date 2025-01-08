import axios from 'axios';
import { ApiResponse } from './types';

const objectToQueryString = (params = {}) => Object.entries(params).reduce(
  (acc, [key, value], index) => `${acc}${index > 0 ? '&' : ''}${key}=${value}`,
  '',
);

const makeRequest = async <T = any>({
  url,
  options,
  queryParams,
  useAxios = false,
}: {
  options?: {
    body?: object | FormData;
    headers?: object;
    method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  };
  queryParams?: object;
  url: string;
  useAxios?: boolean;
}): Promise<ApiResponse<T>> => {
  const parsedUrl = url.startsWith('http')
    ? url
    : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  const completeUrl = queryParams
    ? `${parsedUrl}?${objectToQueryString(queryParams)}`
    : parsedUrl;

  const useFormData = options?.body instanceof FormData;
  try {
    const requestOptions = {
      method: 'GET',
      ...options,
      body: useFormData
        ? (options?.body as FormData)
        : JSON.stringify(options?.body),
      headers: {
        ...(useFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options?.headers || {}),
      },
    };
    if (useAxios) {
      const response = await axios({
        url: completeUrl,
        ...requestOptions,
        withCredentials: true,
      });
      if (response.status >= 200 && response.status <= 299) {
        return { data: await response.data, success: true };
      }
      console.log(`API request failed: ${completeUrl}. Details: ${response}`);
      return { data: await response.data, success: false };
    }

    const response = await fetch(completeUrl, {
      ...requestOptions,
      credentials: 'include',
    });
    if (response.status >= 200 && response.status <= 299) {
      return { data: await response.json(), success: true };
    }
    const res = await response.json();
    console.log(
      `API request failed: ${response.url}. Details: ${
        useAxios ? response : JSON.stringify(res, undefined, 2)
      }`,
    );
    return { ...res, success: false };
  } catch (err: unknown) {
    console.log(`API request failed: ${completeUrl}. Details: ${err}`);
    return { success: false };
  }
};

export default makeRequest;
