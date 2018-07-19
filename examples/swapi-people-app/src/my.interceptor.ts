import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@martin_hotell/axios-http'
import { Injectable } from 'injection-js'

import { Logger } from './logger.service'
import { SWAPICollection } from './types'

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  // we can inject other injectables
  constructor(private logger: Logger) {}

  interceptRequest(request: HttpRequest) {
    // const modifiedData = request.data.replace(/pizza/gi, '🍕')
    // const modifiedRequest = { ...request, data: modifiedData }

    // return modifiedRequest
    return request
  }

  interceptRequestError(error: any) {
    this.logger.error('whooops!')

    return Promise.reject(error)
  }

  interceptResponse(response: HttpResponse<SWAPICollection<any>>) {
    this.logger.log('---> data:', response.data)
    this.logger.log('---> params:', response.config.params)

    // const normalizedData = { data: response.data.results }
    const normalizedData = {}

    return { ...response, ...normalizedData }
  }

  interceptResponseError(error: any) {
    this.logger.error('whooops!')

    return Promise.reject(error)
  }
}
