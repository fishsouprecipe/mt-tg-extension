export enum Method {
    Get = 'GET',
    Put = 'PUT',
    Post = 'POST',
}

export type Payload = {[P: string]: any}
export type Headers = {[P: string]: any}

export interface IRequest {
    method: Method
    url: string
    headers?: Headers
    payload?: Payload
}

export interface IResponce {
    ok: boolean
    result: string
    description?: string
    error_code?: number
}
