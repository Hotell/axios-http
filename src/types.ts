import { AxiosInstance } from 'axios'

/**
 * AxiosInstance interface withouht callable definitions
 */
export type AxiosClient = Pick<AxiosInstance, keyof AxiosInstance>
