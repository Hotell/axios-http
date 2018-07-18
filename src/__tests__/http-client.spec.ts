// tslint:disable:no-magic-numbers

import 'core-js/es7/reflect'

import { Injectable, ReflectiveInjector } from 'injection-js'

import { HttpClientConfig } from '../config'
import { HttpClient } from '../http-client'

describe(`HttpClient`, () => {
  it(`should create httpClient instance with default config`, () => {
    const httpClient = new HttpClient()

    expect(httpClient).toBeTruthy()
  })

  it(`should create httpClient instance with custom injected config`, () => {
    const config = {
      baseURL: '/api/swapi',
      withCredentials: true,
      timeout: 1000,
    } as HttpClientConfig
    const httpClient = new HttpClient(config)

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
        return this.http.get('users')
      }
    }

    const injector = ReflectiveInjector.resolveAndCreate([
      HttpClient,
      UserService,
    ])

    const httpClient: HttpClient = injector.get(HttpClient)
    const userService: UserService = injector.get(UserService)

    jest.spyOn(httpClient, 'get').mockImplementation(() => {
      return
    })

    expect(httpClient.get).not.toBeCalled()

    userService.getUsers()

    expect(httpClient.get).toBeCalledWith('users')
  })
})
