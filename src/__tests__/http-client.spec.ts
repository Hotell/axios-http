// tslint:disable:no-magic-numbers

import { Injectable, ReflectiveInjector } from 'injection-js'

import { HttpClient } from '../client'
import { HttpClientConfig } from '../config'
import {
  HTTP_INTERCEPTORS,
  HttpInterceptor,
  HttpInterceptorHandler,
  NoopInterceptor,
} from '../interceptor'
import { _AxiosInterceptors, HttpRequest, HttpResponse } from '../types'

describe(`HttpClient`, () => {
  const interceptors = [] as HttpInterceptor[]
  const httpInterceptorHandler = new HttpInterceptorHandler(interceptors)
  it(`should create httpClient instance with default config`, () => {
    const httpClient = new HttpClient(httpInterceptorHandler)

    expect(httpClient).toBeTruthy()
  })

  it(`should create httpClient instance with custom injected config`, () => {
    const config = {
      baseURL: '/api/swapi',
      withCredentials: true,
      timeout: 1000,
    } as HttpClientConfig
    const httpClient = new HttpClient(httpInterceptorHandler, config)

    expect(httpClient).toBeTruthy()
    expect(httpClient.defaults.timeout).toBe(1000)
    expect(httpClient.defaults.withCredentials).toBe(true)
    expect(httpClient.defaults.baseURL).toBe('/api/swapi')
  })

  it(`should be properly injected via DI framework`, () => {
    @Injectable()
    class UserService {
      constructor(private http: HttpClient) {}
      getUsers() {
        return this.http
          .get('users')
          .then((response) => console.log('getUsers response:', response))
      }
    }

    const injector = ReflectiveInjector.resolveAndCreate([
      { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
      HttpInterceptorHandler,
      HttpClient,
      UserService,
    ])

    const httpClient: HttpClient = injector.get(HttpClient)
    const userService: UserService = injector.get(UserService)

    jest.spyOn(httpClient, 'get').mockImplementation(() => {
      return Promise.resolve([
        {
          id: 1,
          name: 'Martin',
        },
      ])
    })

    expect(httpClient.get).not.toBeCalled()

    userService.getUsers().catch(console.error)

    expect(httpClient.get).toBeCalledWith('users')
  })

  describe(`interceptors`, () => {
    @Injectable()
    class TestInterceptor implements HttpInterceptor {
      interceptRequest(request: HttpRequest) {
        return request
      }
      interceptResponse(response: HttpResponse) {
        return response
      }
    }

    it(`should support interceptors via mutli:true`, () => {
      const injector = ReflectiveInjector.resolveAndCreate([
        HttpClient,
        HttpInterceptorHandler,
        { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TestInterceptor, multi: true },
      ])

      const httpClient: HttpClient = injector.get(HttpClient)
      const registeredInterceptors = httpClient.interceptors as _AxiosInterceptors

      expect(registeredInterceptors.request.handlers).toHaveLength(2)
      expect(registeredInterceptors.response.handlers).toHaveLength(2)
      expect(registeredInterceptors.request.handlers[0].fulfilled).toBeTruthy()
      expect(
        registeredInterceptors.request.handlers[0].rejected
      ).toBeUndefined()
      expect(registeredInterceptors.response.handlers[1].fulfilled).toBeTruthy()
      expect(
        registeredInterceptors.response.handlers[1].rejected
      ).toBeUndefined()

      expect(httpClient.interceptors.request).toBeTruthy()
      expect(httpClient.interceptors.response).toBeTruthy()
    })
  })
})
