import { Command } from "./base";
import { ElemValue, ElemAttrs } from "../misc";


const setElemAttrs: Command<[elem: HTMLElement, elemAttrs: ElemAttrs], void> = (
    elem: HTMLElement,
    elemAttrs: ElemAttrs,
): void => {
    for (const attrName in elemAttrs) {
        const attrValue = elemAttrs[attrName]

        if (attrValue === null) {
            elem.removeAttribute(attrName)
        } else {
            elem.setAttribute(attrName, attrValue)
        }
    }
}


export const setElemValue: Command<[elem: HTMLElement, elemValue: Partial<ElemValue>], void> = (
    elem: HTMLElement,
    elemValue: Partial<ElemValue>,
): void => {
    if (elemValue.innerText !== undefined) {
        if (elemValue.innerText === null) {
            elem.innerText = ''
        } else {
            elem.innerText = elemValue.innerText
        }
    }

    if (elemValue.innerHTML !== undefined) {
        if (elemValue.innerHTML === null) {
            elem.innerHTML = ''
        } else {
            elem.innerHTML = elemValue.innerHTML
        }
    }

    if (elemValue.attrs !== undefined) {
        setElemAttrs(elem, elemValue.attrs)
    }
}
