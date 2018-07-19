import { Provider } from 'injection-js'
import { HttpClient } from './client'
import { HttpClientConfig } from './config'
import {
  HTTP_INTERCEPTORS,
  HttpInterceptorHandler,
  NoopInterceptor,
} from './interceptor'

export class HttpClientModule {
  static forRoot(config?: HttpClientConfig): Provider[] {
    return [
      { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
      HttpInterceptorHandler,
      { provide: HttpClientConfig, useValue: config },
      HttpClient,
    ]
  }
}
