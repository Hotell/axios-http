import {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosTransformer,
} from 'axios'

/**
 * AxiosInstance interface without callable definitions
 * @private
 */
export type AxiosClient = Pick<AxiosInstance, keyof AxiosInstance>

export interface HttpTransformer<T = any, R extends T = T>
  extends AxiosTransformer {
  (data: T, headers?: any): R
}

export interface HttpRequest<T = any> extends AxiosRequestConfig {
  transformRequest?: HttpTransformer<T> | HttpTransformer<T>[]
  transformResponse?: HttpTransformer<T> | HttpTransformer<T>[]
  data?: T
}
export interface HttpResponse<T = any> extends AxiosResponse<T> {}

/**
 * @private
 */
// tslint:disable-next-line:class-name
export interface _AxiosInterceptorManager<T = any>
  extends AxiosInterceptorManager<T> {
  // tslint:disable-next-line:ban-types
  handlers: Partial<{ fulfilled: Function; rejected: Function }>[]
}

// tslint:disable-next-line:class-name
export interface _AxiosInterceptors {
  request: _AxiosInterceptorManager<AxiosRequestConfig>
  response: _AxiosInterceptorManager<AxiosResponse>
}
