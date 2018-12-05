// tslint:disable:jsx-no-lambda

import {
  HTTP_INTERCEPTORS,
  registerHttpClientProviders,
} from '@martin_hotell/axios-http'
import { ReflectiveInjector } from 'injection-js'
import { Component, FunctionalComponent as SFC, h } from 'preact'

import { Logger } from './logger.service'
import { MyInterceptor } from './my.interceptor'
import { User, UserService } from './user.service'

const injector = ReflectiveInjector.resolveAndCreate([
  Logger,
  // register providers and configure
  registerHttpClientProviders({ baseURL: 'https://swapi.co/api/' }),
  // wire up our interceptor
  { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
  UserService,
])

type Maybe<T> = T | null

type State = typeof initialState
const initialState = {
  error: null as any,
  users: null as Maybe<User[]>,
  previous: null as Maybe<string>,
  next: null as Maybe<string>,
  loading: true,
}

export class App extends Component<{}, State> {
  state = initialState
  private userService: UserService = injector.get(UserService)
  render() {
    const { users, next, previous, loading, error } = this.state

    return (
      <div class="container">
        <h1>
          axios-http <small>demo</small>
        </h1>
        {error ? (
          <div style={{ color: 'red' }}>
            An Error ocurred!
            <pre>{error}</pre>
          </div>
        ) : null}
        <div class="card">
          <div class="card-body" style={{ minHeight: '200px' }}>
            <h4 class="card-title">Star Wars characters index</h4>
            <p class="card-text">
              {loading ? 'Loading...' : <UserList users={users!} />}
            </p>
          </div>
          <div class="row flex-spaces flex-middle" style={{ width: '100%' }}>
            <button
              disabled={!previous || loading}
              onClick={() => this.getPage(previous)}
            >
              previous
            </button>
            <div>page: {this.getPageNumber(next) - 1}</div>
            <button disabled={loading} onClick={() => this.getPage(next)}>
              next
            </button>
          </div>
        </div>
      </div>
    )
  }
  private getPageNumber(url: Maybe<string>) {
    if (!url) {
      return 0
    }
    const matched = url.match(/.*(\d)$/)
    if (!matched) {
      return 0
    }

    return Number(matched[1])
  }
  getPage = (url: Maybe<string>) => {
    const pageCount = this.getPageNumber(url)

    this.setState({ loading: true }, () => {
      this.userService
        .getUsers(pageCount)
        .then((response) => {
          const { results: users, next, previous } = response
          this.setState({ users, next, previous, loading: false })
        })
        .catch((error) => {
          this.setState({ error })
        })
    })
  }
  componentDidMount() {
    this.userService.getUsers().then((response) => {
      const { results: users, next, previous } = response
      this.setState({ users, next, previous, loading: false })
    })
  }
}

type Props = { users: User[] }
const UserList: SFC<Props> = ({ users }) => {
  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
