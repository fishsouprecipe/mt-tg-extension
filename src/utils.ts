import { getComputedElemStyle } from './cmds/get_computed_elem_style'

export type WaitUntilOptions = {
    timeout?: number
    heartRate?: number
}


const defaultWaitUntilOptions: Required<Omit<WaitUntilOptions, 'callback'>> = {
    timeout: 10000,
    heartRate: 20,
}


export const waitUntil = (callback: () => boolean, options: WaitUntilOptions): Promise<void> => {
    const timeout: number = options.timeout ?? defaultWaitUntilOptions.timeout
    const heartRate: number = options.heartRate ?? defaultWaitUntilOptions.heartRate

    if (timeout < 0) {
        throw new Error('Timeout cannot be less than 0')
    }

    const checkTimeout: boolean = (timeout > 0)

    return new Promise((resolve, reject): void => {
        if (callback()) {
            resolve()
        } else {
            const t1: number = Date.now()
            const intervalID: number = window.setInterval(() => {
                if (callback()) {
                    window.clearInterval(intervalID)
                    resolve()
                } else if (checkTimeout && (Date.now() - t1 > timeout)) {
                    reject()
                }
            }, heartRate)
        }
    });
}


export const isElemVisible = (elem: HTMLElement): boolean => {
    return (getComputedElemStyle(elem).getPropertyValue('opacity') === '1')
}


