import { getElemBySelector } from './cmds/get_elem_by_selector';
import { StorageKey, getStorageValue, setStorageValue } from './storage_stuff';


enum InputName {
    MainURL,
    DataPath,
}


const inputNamesXStorageKeys: {[P in InputName]: StorageKey} = {
    [InputName.MainURL]: StorageKey.MainURL,
    [InputName.DataPath]: StorageKey.DataPath,
}


const inputSelectors: {[P in InputName]: string} = {
    [InputName.MainURL]: '#main_url',
    [InputName.DataPath]: '#data_path',
}


window.addEventListener('load', () => {
    for (const inputName of [
        InputName.MainURL,
        InputName.DataPath,
    ]) {
        const input: HTMLInputElement = getElemBySelector(inputSelectors[inputName]) as HTMLInputElement
        const storageKey: StorageKey = inputNamesXStorageKeys[inputName]

        getStorageValue(storageKey).then((value: string) => {
            if (value) {
                input.value = value
            }
        }).then(() => {
            input.addEventListener('change', () => {
                setStorageValue(storageKey, input.value)
            })
        })
    }
})
