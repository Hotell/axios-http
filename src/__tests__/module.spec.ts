import { ReflectiveInjector } from 'injection-js'

import { HttpClient } from '../client'
import { HttpClientModule, registerHttpClientProviders } from '../module'

describe(`HttpClientModule`, () => {
  it(`should register all providers via forRoot`, () => {
    // tslint:disable-next-line:deprecation
    const providers = HttpClientModule.forRoot()

    const injector = ReflectiveInjector.resolveAndCreate(providers)

    const httpClient = injector.get(HttpClient)

    expect(httpClient).toBeInstanceOf(HttpClient)
  })

  it(`should register all providers via registerHttpClientProviders`, () => {
    const providers = registerHttpClientProviders()

    const injector = ReflectiveInjector.resolveAndCreate(providers)

    const httpClient = injector.get(HttpClient)

    expect(httpClient).toBeInstanceOf(HttpClient)
  })

  it(`should support configuration on register`, () => {
    const providers = registerHttpClientProviders({
      baseURL: 'https://api.githup.com',
    })

    const injector = ReflectiveInjector.resolveAndCreate(providers)

    const httpClient: HttpClient = injector.get(HttpClient)

    expect(httpClient).toBeInstanceOf(HttpClient)
    expect(httpClient.defaults.baseURL).toBe('https://api.githup.com')
  })
})
