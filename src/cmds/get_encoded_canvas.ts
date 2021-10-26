import { Command } from "./base";

export const getEncodedCanvas: Command<
    [canvas: HTMLCanvasElement], string
> = (canvas: HTMLCanvasElement): string => {
    const dataStr: string = canvas.toDataURL()
    const re: RegExp = /^data:image\/(png|jpg|jpeg);base64,/

    return dataStr.replace(re, '');
}
