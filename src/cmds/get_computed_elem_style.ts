import { Command } from "./base";


export const getComputedElemStyle: Command<[elem: HTMLElement], CSSStyleDeclaration> = (
    elem: HTMLElement,
): CSSStyleDeclaration => {
    return window.getComputedStyle(elem)
}
