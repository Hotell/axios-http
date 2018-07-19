import { Injectable } from 'injection-js'

@Injectable()
export class Logger {
  log(...args: any[]) {
    console.log(...args)
  }
  error(...args: any[]) {
    console.error(...args)
  }
}
