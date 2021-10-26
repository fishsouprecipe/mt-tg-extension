import { Command } from "./base";


export const hideElem: Command<[elem: HTMLElement], void> = (
    elem: HTMLElement,
): void => {
    elem.classList.add('hidden')
}
