import { HttpClient } from '@martin_hotell/axios-http'
import { Injectable } from 'injection-js'
import { SWAPICollection } from './types'

export interface User {
  id: number
  name: string
}

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(page = 1) {
    return this.http
      .get<SWAPICollection<User>>(`people`, { params: { page } })
      .then((response) => response.data)
  }
}
