# axios-http

> Injectable axios wrapper for Angular and [injection-js](https://github.com/mgechev/injection-js) 🎯

[![Greenkeeper badge](https://badges.greenkeeper.io/hotell/axios-http.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/Hotell/axios-http.svg?branch=master)](https://travis-ci.org/Hotell/axios-http)
[![NPM version](https://img.shields.io/npm/v/%40martin_hotell%2Faxios-http.svg)](https://www.npmjs.com/package/@martin_hotell/axios-http)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## Installing

```sh
yarn add @martin_hotell/axios-http

# install peer dependencies
yarn add axios injection-js tslib

# install Reflect API polyfill
yarn add @abraham/reflection
```

> **Note:**
>
> You need a polyfill for the [Reflect API](http://www.ecma-international.org/ecma-262/6.0/#sec-reflection).
>
> We highly recommend tiny [reflection](https://www.npmjs.com/package/@abraham/reflection) polyfill ( 3kB only ! )
>
> Also for TypeScript you will need to enable `experimentalDecorators` and `emitDecoratorMetadata` flags within your `tsconfig.json`

## Getting started

### with injection-js:

```ts
import { Injectable, ReflectiveInjector } from 'injection-js'
import {
  registerHttpClientProviders,
  HttpClient,
} from '@martin_hotell/axios-http'

@Injectable()
class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>('/api/users')
  }
}

const injector = ReflectiveInjector.resolveAndCreate([
  registerHttpClientProviders(),
  UserService,
])
```

### With Angular:

```ts
import { Module } from '@angular/core'
import { HttpClientModule, HttpClient } from '@martin_hotell/axios-http'

@Injectable({
  provideIn: 'root',
})
class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>('/api/users')
  }
}

@Module({
  providers: [HttpClient, HttpClientModule.forRoot()],
})
class AppModule {}
```

## API

axios-http is just a injectable wrapper which creates an axios instance, so API is the same as for axios.instance ( except Interceptors )

- HttpClient [methods](https://github.com/axios/axios#instance-methods)
- HttpClient [request config schema](https://github.com/axios/axios#request-config)
- HttpClient [response schema ](https://github.com/axios/axios#response-schema)

## Examples

Go checkout [examples](./examples) !

## Guides

### Type-checking the response

When you execute `http.get('/api/user/123').then(response=>response.data)`, on Success the response object is typeof `AxiosPromise<any>` with anonymous type of `data` property. It doesn't know what the shape of that object is.

You can tell `HttpClient` the type of the response, to make consuming the output easier and more obvious.

First, define an interface with the correct shape:

```ts
export interface User {
  name: string
  email: string
}
```

Then, specify that interface as the `HttpClient.get()` call's generic type parameter in the service:

```ts
getUser(id:string) {
  // now returns a Promise<User>
  return this.http.get<User>(`/api/users/${id}`).then(response => response.data);
}
```

Now our `getUser()` returns typed data property as `Promise<User>`, so we can access our data in type-safe way

```ts
heroService.getUser('123').then({name,email}=>...)
```

### Configuring HttpClient

- when registering providers you can pass optional config to `forRoot(config)`

```ts
import { Injectable, ReflectiveInjector } from 'injection-js'
import { HttpClientModule, HttpClientModule } from '@martin_hotell/axios-http'

@Injectable()
class UserService {
  /*...*/
}

const injector = ReflectiveInjector.resolveAndCreate([
  HttpClientModule.forRoot({
    baseUrl: 'api/swapi',
    withCredentials: true,
  }),
  UserService,
])
```

### Registering Interceptors

`axios-http` implements similar API for registering interceptors like Angular HttpClient, so you can inject any other service to your interceptors. Under the hood it transforms this API to leverage pure `axios` ✌️

To wire-up our interceptor, you need to register provider via `HTTP_INTERCEPTORS` token and set `mutli:true`:

```ts
import { Injectable, ReflectiveInjector } from 'injection-js'
import {
  HttpClientModule,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpRequest,
  HttpResponse,
} from '@martin_hotell/axios-http'

@Injectable()
class Logger {
  log(...args: any[]) {}
  error(...args: any[]) {}
}

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  // we can inject other injectables
  constructor(private logger: Logger) {}

  interceptRequest(request: HttpRequest) {
    const modifiedData = request.data.replace(/pizza/gi, '🍕')
    const modifiedRequest = { ...request, data: modifiedData }

    return modifiedRequest
  }

  interceptRequestError(error: any) {
    this.logger.error('whooops!')

    return Promise.reject(error)
  }

  interceptResponse(response: HttpResponse) {
    this.logger.log('---> data:', response.data)
    this.logger.log('---> filter:', response.params.get('filter'))

    return response
  }

  interceptResponseError(error: any) {
    this.logger.error('whooops!')

    return Promise.reject(error)
  }
}

const injector = ReflectiveInjector.resolveAndCreate([
  Logger,
  HttpClientModule.forRoot(),
  // wire up our interceptor
  { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
])
```

---

## Publishing

Execute `yarn release` which will handle following tasks:

- bump package version and git tag
- update/(create if it doesn't exist) CHANGELOG.md
- push to github master branch + push tags
- publish build packages to npm

> releases are handled by awesome [standard-version](https://github.com/conventional-changelog/standard-version)

### Pre-release

- To get from `1.1.2` to `1.1.2-0`:

`yarn release --prerelease`

- **Alpha**: To get from `1.1.2` to `1.1.2-alpha.0`:

`yarn release --prerelease alpha`

- **Beta**: To get from `1.1.2` to `1.1.2-beta.0`:

`yarn release --prerelease beta`

### Dry run mode

See what commands would be run, without committing to git or updating files

`yarn release --dry-run`

### Check what files are gonna be published to npm

- `yarn pack` OR `yarn release:preflight` which will create a tarball with everything that would get published to NPM

## Tests

Test are written and run via Jest 💪

```
yarn test
# OR
yarn test:watch
```

## Style guide

Style guides are enforced by robots, I meant prettier and tslint of course 🤖 , so they'll let you know if you screwed something, but most of the time, they'll autofix things for you. Magic right ?

### Style guide npm scripts

```sh
#Format and fix lint errors
yarn ts:style:fix
```

## Generate documentation

`yarn docs`

## Commit ( via commitizen )

- this is preferred way how to create convetional-changelog valid commits
- if you preffer your custom tool we provide a commit hook linter which will error out, it you provide invalid commit message
- if you are in rush and just wanna skip commit message valiation just prefix your message with `WIP: something done` ( if you do this please squash your work when you're done with proper commit message so standard-version can create Changelog and bump version of your library appropriately )

`yarn commit` - will invoke [commitizen CLI](https://github.com/commitizen/cz-cli)

### Troubleshooting

## Licensing

[MIT](./LICENSE.md) as always
