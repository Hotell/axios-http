# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.3.0"></a>

# [0.3.0](https://www.github.com/Hotell/axios-http/compare/v0.2.0...v0.3.0) (2018-07-23)

### Bug Fixes

- export forgotten registerHttpClientProviders to make it availabe as public api (#3) ([3da051c](https://www.github.com/Hotell/axios-http/commit/3da051c))

### Features

- **module:** add registerHttpClientProviders for registering providers ([f0c95ea](https://www.github.com/Hotell/axios-http/commit/f0c95ea))

<a name="0.2.0"></a>

# [0.2.0](https://www.github.com/Hotell/axios-http/compare/v0.1.1...v0.2.0) (2018-07-19)

### Features

- **interceptors:** add interceptors registration support via DI ([dfc0ce7](https://www.github.com/Hotell/axios-http/commit/dfc0ce7))
- **module:** implement module class for registering all providers ([f22b44f](https://www.github.com/Hotell/axios-http/commit/f22b44f))

### BREAKING CHANGES

- **module:** You need to register all proiders via module forRoot static method

**Before:**

```ts
import { Injectable, ReflectiveInjector } from 'injection-js'
import { HttpClient } from '@martin_hotell/axios-http'

@Injectable()
class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>('/api/users')
  }
}

const injector = ReflectiveInjector.resolveAndCreate([HttpClient, UserService])
```

**After:**

```ts
import { Injectable, ReflectiveInjector } from 'injection-js'
import { HttpClientModule, HttpClient } from '@martin_hotell/axios-http'

@Injectable()
class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>('/api/users')
  }
}

const injector = ReflectiveInjector.resolveAndCreate([
  HttpClientModule.forRoot(),
  UserService,
])
```

<a name="0.1.1"></a>

## [0.1.1](https://www.github.com/Hotell/axios-http/compare/v0.1.0...v0.1.1) (2018-07-18)

### Bug Fixes

- **build:** don't bundle peer deps ([b04b381](https://www.github.com/Hotell/axios-http/commit/b04b381))

<a name="0.1.0"></a>

# 0.1.0 (2018-07-18)

### Features

- **http-client:** add http-client implementation ([17d337c](https://www.github.com/Hotell/axios-http/commit/17d337c))
