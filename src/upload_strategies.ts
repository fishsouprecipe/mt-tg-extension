import { Data } from './misc'
import { UploadStrategy } from './uploader'
import { Method, Payload, Headers } from './net'
import { StorageKey, getStorageValue } from './storage_stuff'


export class UploadDataStrategy extends UploadStrategy<
    [data: Data, encodedCanvas: string]
> {
    public method: Method = Method.Post

    public getUrl = (): Promise<string> => {
        return new Promise(async (resolve) => {
            const mainURL: string = await getStorageValue(StorageKey.MainURL)
            const dataPath: string = await getStorageValue(StorageKey.DataPath)
            resolve(mainURL + dataPath)
        })
    }

    public getPayload = (data: Data, encodedCanvas: string): Promise<Payload> => {
        return new Promise((resolve) => {
            resolve({
                data: JSON.stringify(data),
                screenshot: encodedCanvas,
            })
        })
    }

    public getHeaders = (): Promise<Headers> => {
        return new Promise((resolve) => {
            resolve([])
        })
    }
}
