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
yarn add axios tslib

# install Reflect API polyfill
yarn add core-js
```

> **Note:**
>
> You need a polyfill for the [Reflect API](http://www.ecma-international.org/ecma-262/6.0/#sec-reflection).
> You can use:
>
> - [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
> - [`core-js` (`core-js/es7/reflect`)](https://www.npmjs.com/package/core-js)
>
> Also for TypeScript you will need to enable `experimentalDecorators` and `emitDecoratorMetadata` flags within your `tsconfig.json`

## Getting started

### with injection-js:

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

## Examples

Go checkout [examples](./examples) !

## Guides

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
