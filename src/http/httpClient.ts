import axios, { AxiosInstance, AxiosResponse } from "axios";

export type Interceptor = {
  onFulfilled?: (value: any) => any;
  onRejected?: (error: any) => any;
};

export type HttpClientOptions = {
  baseURL?: string;
  requestInterceptor?: Interceptor;
  responseInterceptor?: Interceptor;
  onResponseToast?: (response: AxiosResponse) => void;
  onErrorToast?: (error: any) => void;
};

/**
 * Creates a configured Axios instance with optional request/response interceptors
 * and toast hooks for success/error notifications.
 */
export function createHttpClient(options: HttpClientOptions = {}): AxiosInstance {
  const instance = axios.create({ baseURL: options.baseURL || "" });

  // Request Interceptor
  if (options.requestInterceptor) {
    instance.interceptors.request.use(
      options.requestInterceptor.onFulfilled,
      options.requestInterceptor.onRejected
    );
  }

  // Response Interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Hook for success toast
      if (options.onResponseToast) {
        try { options.onResponseToast(response); } catch {}
      }
      // Allow custom fulfilled interceptor to transform/return
      if (options.responseInterceptor?.onFulfilled) {
        return options.responseInterceptor.onFulfilled(response);
      }
      return response;
    },
  (error: any) => {
      // Hook for error toast
      if (options.onErrorToast) {
        try { options.onErrorToast(error); } catch {}
      }
      // Allow custom rejected interceptor
      if (options.responseInterceptor?.onRejected) {
        return options.responseInterceptor.onRejected(error);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
