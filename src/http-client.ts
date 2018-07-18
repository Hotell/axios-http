// tslint:disable-next-line:match-default-export-name
import axios, {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { Inject, Injectable, Optional } from 'injection-js'

import { defaultConfig, HttpClientConfig } from './config'
import { AxiosClient } from './types'

@Injectable()
export class HttpClient implements AxiosClient {
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse<any>>
  }

  private _provider: AxiosInstance
  constructor(
    @Optional()
    @Inject(HttpClientConfig)
    config?: HttpClientConfig
  ) {
    this._provider = axios.create({ ...defaultConfig, ...config })
    this.interceptors = this._provider.interceptors
    this.defaults = this._provider.defaults
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
    return this._provider.request(config)
  }
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._provider.get(url, config)
  }
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return this._provider.delete(url, config)
  }
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._provider.head(url, config)
  }
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this._provider.post(url, data, config)
  }
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this._provider.put(url, data, config)
  }
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this._provider.patch(url, data, config)
  }
}
