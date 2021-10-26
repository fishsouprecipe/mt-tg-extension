import * as html2canvas from 'html2canvas'
import { Options as H2COptions } from 'html2canvas'

import { Command } from './base'

type Options = {
    expand: number
    bgColor: string
}


// Start of hack
type H2C = (element: HTMLElement, options?: Partial<H2COptions>) => Promise<HTMLCanvasElement>


const h2c: H2C = (html2canvas.default ?? html2canvas) as H2C


export const getElemCanvas: Command<
    [elem: HTMLElement, options: Options], Promise<HTMLCanvasElement>
> = (elem: HTMLElement, options: Options): Promise<HTMLCanvasElement> => {
    const rect: DOMRect = elem.getBoundingClientRect()

    return h2c(
        elem, {
            backgroundColor: options.bgColor,
            width: rect.width + options.expand,
            height: rect.height + options.expand,
            x: rect.x - options.expand / 2,
            y: rect.y - options.expand / 2,
        }
    )
}
