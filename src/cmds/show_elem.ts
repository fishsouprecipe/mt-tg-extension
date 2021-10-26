import { Command } from "./base";


export const showElem: Command<[elem: HTMLElement], void> = (
    elem: HTMLElement,
): void => {
    elem.classList.remove('hidden')
}
