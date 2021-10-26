import { ElemValue, ElemAttrs } from './misc'


export interface CompareStrategy<A extends any[]> {
    compare(...args: A): boolean
}


export class Comparator<A extends any[]> {
    constructor(
        public compareStrategy: CompareStrategy<A>,
    ) {}

    public compare = (...args: A): boolean => {
        return this.compareStrategy.compare(...args)
    }
}


export class ElemValueIsDefault implements CompareStrategy<
    [elemValue: ElemValue, defaultElemValue: Partial<ElemValue>]
> {
    private bothIsNotUndefined: 'sentinel' = 'sentinel'

    private compareUndefined = (obj: any, defaultObj: any): boolean | 'sentinel' => {
        if (defaultObj === undefined) {
            return true
        }

        if (defaultObj !== undefined && obj === undefined) {
            return false
        }

        return this.bothIsNotUndefined
    }

    private compareInnerText = (innerText: string | undefined, defaultInnerText: string | undefined): boolean => {
        const bothInUndefinedCheck: boolean | 'sentinel' = this.compareUndefined(innerText, defaultInnerText)

        if (bothInUndefinedCheck !== this.bothIsNotUndefined) {
            return bothInUndefinedCheck
        }

        return (innerText.trim() === defaultInnerText.trim())

    }


    private compareInnerHTML = (innerHTML: string | undefined, defaultInnerHTML: string | undefined): boolean => {
        const bothInUndefinedCheck: boolean | 'sentinel' = this.compareUndefined(innerHTML, defaultInnerHTML)

        if (bothInUndefinedCheck !== this.bothIsNotUndefined) {
            return bothInUndefinedCheck
        }

        return (innerHTML.trim() === defaultInnerHTML.trim())

    }

    private compareAttrs = (attrs: ElemAttrs, defaultAttrs: ElemAttrs): boolean => {
        const bothInUndefinedCheck: boolean | 'sentinel' = this.compareUndefined(attrs, defaultAttrs)

        if (bothInUndefinedCheck !== this.bothIsNotUndefined) {
            return bothInUndefinedCheck
        }

        for (const attrName in defaultAttrs) {
            if (attrs[attrName] !== defaultAttrs[attrName]) {
                return false
            }
        }

        return true
    }


    public compare = (elemValue: ElemValue, defaultElemValue: Partial<ElemValue>): boolean => {
        return (
            this.compareInnerText(elemValue.innerText,    defaultElemValue.innerText)
            && this.compareInnerHTML(elemValue.innerHTML, defaultElemValue.innerHTML)
            && this.compareAttrs(elemValue.attrs,         defaultElemValue.attrs)
        )
    }
}
