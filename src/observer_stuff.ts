export type ObserverHelperCallback = (observerHelper?: ObserverHelper) => any

export enum ObserverHelperEventName {
    Show,
    Hide,
    SpecificMutation,
}


const doesContainHidden = (classString: string | null | undefined): boolean => {
    return (classString && classString.includes('hidden'))
}


export class ObserverHelper {
    public events: Partial<{[P in ObserverHelperEventName]: ObserverHelperCallback[]}>

    constructor() {
        this.events = {}
    }

    public register = (eventName: ObserverHelperEventName, callback: ObserverHelperCallback): void => {
        if (eventName in this.events) {
            this.events[eventName].push(callback)
        } else {
            this.events[eventName] = [callback]
        }
    }

    public unregister = (callback: ObserverHelperCallback): void => {
        for (const eventNameBroken in Object.keys(this.events)) {
            const eventName: ObserverHelperEventName = eventNameBroken as unknown as ObserverHelperEventName
            this.events[eventName] = this.events[eventName].filter((cb: ObserverHelperCallback) => {
                return (cb !== callback)
            })

            if (this.events[eventName].length === 0) {
                delete this.events[eventName]
            }
        }
    }

    public emit = (eventName: ObserverHelperEventName): void => {
        if (eventName in this.events) {
            for (const callback of this.events[eventName]) {
                callback(this)
            }
        }
    }

    public callback = (mutationRecords: MutationRecord[]): void => {
        for (const mutationRecord of mutationRecords) {
            const mutationTarget: HTMLElement = mutationRecord.target as HTMLElement
            const wasHidden: boolean = doesContainHidden(mutationRecord.oldValue)
            const isHidden: boolean = doesContainHidden(mutationTarget.getAttribute('class'))

            if (wasHidden && !isHidden) {
                this.emit(ObserverHelperEventName.Show)

            } else if (!wasHidden && isHidden) {
                this.emit(ObserverHelperEventName.Hide)

            } else {
                this.emit(ObserverHelperEventName.SpecificMutation)
            }
        }
    }
}


export const getObserver = (observerHelper: ObserverHelper): MutationObserver => {
    return new MutationObserver(observerHelper.callback)
}
