import axios from 'axios'

import { AxiosCustomResponse } from 'src/utils/handleRequest'

declare module 'axios' {
  export interface AxiosInstance {
    request<T = AxiosCustomResponse>(config: any): Promise<T>
    get<T = AxiosCustomResponse>(url: string, config?: any): Promise<T>
    delete<T = AxiosCustomResponse>(url: string, config?: any): Promise<T>
    head<T = AxiosCustomResponse>(url: string, config?: any): Promise<T>
    post<T = AxiosCustomResponse>(url: string, data?: any, config?: any): Promise<T>
    put<T = AxiosCustomResponse>(url: string, data?: any, config?: any): Promise<T>
    patch<T = AxiosCustomResponse>(url: string, data?: any, config?: any): Promise<T>
  }
}
