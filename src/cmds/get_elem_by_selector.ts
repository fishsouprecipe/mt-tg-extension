import { Command } from "./base";


export const getElemBySelector: Command<[selector: string], HTMLElement> = (
    selector: string,
): HTMLElement => {
    const elem: HTMLElement | undefined = document.querySelector(selector)

    if (elem === null) {
        throw new Error("Cannot get element by '" + selector + "' selector, null instead.");
    }

    if (elem === undefined) {
        throw new Error("Cannot get element by '" + selector + "' selector, undefined instead.");
    }

    return elem
}
