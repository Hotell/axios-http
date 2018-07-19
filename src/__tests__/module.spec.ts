import { ReflectiveInjector } from 'injection-js'

import { HttpClient } from '../client'
import { HttpClientModule } from '../module'

describe(`HttpClientModule`, () => {
  it(`should register all providers via forRoot`, () => {
    const providers = HttpClientModule.forRoot()

    const injector = ReflectiveInjector.resolveAndCreate(providers)

    const httpClient = injector.get(HttpClient)

    expect(httpClient).toBeInstanceOf(HttpClient)
  })
})
