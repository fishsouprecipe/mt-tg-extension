export enum StorageKey {
    MainURL = 'MainURL',
    DataPath = 'DataPath',
    ScreenshotPath = 'ScreenshotPath',
}

type StorageItems = Partial<{[key in StorageKey]: string}>


export const setStorageValue = (
    key: StorageKey,
    value: string,
): Promise<void> => {
    return new Promise((resolve) => {
        chrome.storage.local.set(
            {[key]: value},
            () => {
                resolve()
            }
        )
    })
}


export const getStorageValue = (
    key: StorageKey
): Promise<string> => {
    return new Promise((resolve) => {
        chrome.storage.local.get(
            key,
            (items: StorageItems) => {
                resolve(items[key])
            }
        )
    })
}
