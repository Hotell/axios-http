import { forwardRef, Inject, Injectable, InjectionToken } from 'injection-js'
import { AxiosClient, HttpRequest, HttpResponse } from './types'

export interface HttpInterceptor {
  /**
   * Intercept an outgoing `HttpRequest` and optionally transform it or the
   * response.
   *
   * Typically an interceptor will transform the outgoing request before returning
   * `next.handle(transformedReq)`. An interceptor may choose to transform the
   * response event stream as well, by applying additional Rx operators on the stream
   * returned by `next.handle()`.
   *
   * More rarely, an interceptor may choose to completely handle the request itself,
   * and compose a new event stream instead of invoking `next.handle()`. This is
   * acceptable behavior, but keep in mind further interceptors will be skipped entirely.
   *
   * It is also rare but valid for an interceptor to return multiple responses on the
   * event stream for a single request.q
   */

  interceptRequest?(request: HttpRequest): HttpRequest | Promise<HttpRequest>
  interceptRequestError?(error: any): Promise<any>
  interceptResponse?(
    response: HttpResponse
  ): HttpResponse | Promise<HttpResponse>
  interceptResponseError?(error: any): Promise<any>
}

/**
 * A multi-provider token which represents the array of `HttpInterceptor`s that
 * are registered.
 */
export const HTTP_INTERCEPTORS = new InjectionToken<HttpInterceptor[]>(
  'HTTP_INTERCEPTORS'
)

/**
 * `HttpHandler` which applies an `HttpInterceptor` to an `HttpRequest`.
 * @private
 */
@Injectable()
export class HttpInterceptorHandler {
  private _registeredInterceptors = [] as number[]
  get registeredInterceptors() {
    return this._registeredInterceptors
  }

  constructor(
    @Inject(forwardRef(() => HTTP_INTERCEPTORS))
    private _interceptors: HttpInterceptor[]
  ) {}

  register(httpClientInterceptors: AxiosClient['interceptors']) {
    this._interceptors.forEach((interceptor) => {
      if (interceptor.interceptRequest) {
        this._registeredInterceptors.push(
          httpClientInterceptors.request.use(
            interceptor.interceptRequest.bind(interceptor),
            interceptor.interceptRequestError
              ? interceptor.interceptRequestError.bind(interceptor)
              : void 0
          )
        )
      }
      if (interceptor.interceptResponse) {
        this.registeredInterceptors.push(
          httpClientInterceptors.response.use(
            interceptor.interceptResponse.bind(interceptor),
            interceptor.interceptResponseError
              ? interceptor.interceptResponseError.bind(interceptor)
              : void 0
          )
        )
      }
    })
  }
}

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  interceptRequest(request: HttpRequest) {
    console.log('request:', request)

    return request
  }

  interceptResponse(response: HttpResponse) {
    console.log('response:', response)

    return response
  }
}
