import { Command } from "./base";
import { ElemValue, ElemAttrs } from "../misc";


const getElemAttrs: Command<[elem: HTMLElement], ElemAttrs> = (
    elem: HTMLElement,
): ElemAttrs => {
    const elemAttrs: ElemAttrs = {}

    for (let i = 0; i < elem.attributes.length; i++) {
        const attr: Attr = elem.attributes[i]

        elemAttrs[attr.name] = attr.value
    }

    return elemAttrs
}


export const getElemValue: Command<[elem: HTMLElement], ElemValue> = (
    elem: HTMLElement,
): ElemValue => {
    return {
        innerHTML: elem.innerHTML,
        innerText: elem.innerText,
        attrs: getElemAttrs(elem),
    }
}
