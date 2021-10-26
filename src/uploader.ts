import { Method, Payload, Headers, IRequest, IResponce } from './net'

export abstract class UploadStrategy<A extends any[]> {
    public abstract method: Method
    public abstract getUrl(...args: A): Promise<string>
    public abstract getPayload(...args: A): Promise<Payload>
    public abstract getHeaders(...args: A): Promise<Headers>

    public buildRequest = (...args: A): Promise<IRequest> => {
        return new Promise(async (resolve) => {
            resolve({
                method: this.method,
                url: await this.getUrl(...args),
                headers: await this.getHeaders(...args),
                payload: await this.getPayload(...args),
            })
        })
    }

    public buildResponse = (xhr: XMLHttpRequest): Promise<IResponce> => {
        return new Promise((resolve) => {
            resolve({
                ok: (xhr.status >= 200 && xhr.status < 300),
                description: (xhr.statusText),
                result: (xhr.response),
                error_code: 0,
            })
        })
    }
}


abstract class Uploader<A extends any[]> {
    constructor(
        public uploadStrategy: UploadStrategy<A>
    ) {}

    public abstract resolve(
        resolve: (response: IResponce) => void,
        reject: (response: IResponce) => void,
        response: IResponce
): void
    public abstract reject(
        resolve: (response: IResponce) => void,
        reject: (response: IResponce) => void,
        response: IResponce
): void

    public upload = (...args: A): Promise<IResponce> => {
        return new Promise(async (resolve, reject) => {
            const request: IRequest = await this.uploadStrategy.buildRequest(...args)
            const xhr: XMLHttpRequest = new XMLHttpRequest()

            xhr.open(request.method, request.url)

            if (request.headers !== undefined) {
                for (const headerName in request.headers) {
                    xhr.setRequestHeader(headerName, request.headers[headerName])
                }
            }

            let data: FormData = undefined

            if (request.payload !== undefined) {
                data = new FormData()

                for (const key in request.payload) {
                    data.append(key, request.payload[key])
                }
            }

            xhr.onload = async () => {
                this.reject(
                    resolve,
                    reject,
                    await this.uploadStrategy.buildResponse(xhr),
                )
            }

            xhr.onerror = async () => {
                this.reject(
                    resolve,
                    reject,
                    await this.uploadStrategy.buildResponse(xhr),
                )
            }

            try {
                xhr.send(data)

            } catch {}
        })

    }
}


export class HealthyUploader<A extends any[]> extends Uploader<A> {
    public resolve = (
        resolve: (response: IResponce) => void,
        _reject: (response: IResponce) => void,
        response: IResponce
    ): void => {
        resolve(response)
    }


    public reject = (
        _resolve: (response: IResponce) => void,
        reject: (response: IResponce) => void,
        response: IResponce
    ): void => {
        reject(response)
    }
}


export class SmokerUploader<A extends any[]> extends Uploader<A> {
    public resolve = (
        resolve: (response: IResponce) => void,
        _reject: (response: IResponce) => void,
        response: IResponce
    ): void => {
        resolve(response)
    }


    public reject = (
        resolve: (response: IResponce) => void,
        _reject: (response: IResponce) => void,
        response: IResponce
    ): void => {
        resolve(response)
    }
}
