import { ElemName, elemSelectors } from './misc'
import { getElemBySelector } from './cmds/get_elem_by_selector'
import { showElem } from './cmds/show_elem'
import { hideElem } from './cmds/hide_elem'
import { setElemValue } from './cmds/set_elem_value'


export enum WatermarkPhrase {
    Default = 'monkeytype.com',
    Waiting = 'Waiting',
    DataUploading = 'Uploading data',
    DataUploadingSuccess = 'Data has been uploaded!',
    DataUploadingFailure = 'Uploading data failure :X',
}


export enum Space {
    Text = ' ',
    HTML = '&nbsp;',
}


export type WatermarkOptions = {
    maxDots?: number
    dots?: number
    phrase?: WatermarkPhrase
}


export const defaultWatermarkOptions: Required<WatermarkOptions> = {
    maxDots: 0,
    dots: 0,
    phrase: WatermarkPhrase.Default,
}


export class Watermark {
    private options: Required<WatermarkOptions>
    private intervalID: number
    private running: boolean

    constructor(options?: WatermarkOptions) {
        if (options === undefined) {
            this.options = defaultWatermarkOptions
        } else {
            this.options = {
                maxDots: (options.maxDots) ?? defaultWatermarkOptions.maxDots,
                dots: (options.dots) ?? defaultWatermarkOptions.dots,
                phrase: (options.phrase) ?? defaultWatermarkOptions.phrase,
            }
        }
        this.running = false
    }

    public setOptions = (options: WatermarkOptions, update?: boolean) => {
        if (options.maxDots !== undefined) {
            update = (update === undefined) ? (options.maxDots !== this.options.maxDots) : update
            this.options.maxDots = options.maxDots
        }
        if (options.dots !== undefined) {
            update = (update === undefined) ? (options.dots !== this.options.dots) : update
            this.options.dots = options.dots
        }
        if (options.phrase !== undefined) {
            update = (update === undefined) ? (options.phrase !== this.options.phrase) : update
            this.options.phrase = options.phrase
        }

        if (update) {
            this.update()
        }
    }

    public getElem = (): HTMLElement => getElemBySelector(elemSelectors[ElemName.Watermark])

    public hideElem = (): void => hideElem(this.getElem())

    public showElem = (): void => showElem(this.getElem())

    public setPhrase = (phrase: WatermarkPhrase, update?: boolean): void => this.setOptions({phrase: phrase}, update)

    public getPhrase = (): WatermarkPhrase => this.options.phrase

    public setDots = (dots: number, update?: boolean): void => this.setOptions({dots: dots}, update)

    public getDots = (): number => this.options.dots

    public setMaxDots = (maxDots: number, update?: boolean): void => this.setOptions({maxDots: maxDots}, update)

    public getMaxDots = (): number => this.options.maxDots

    private getDotsString(): string {
        const dots: number = this.options.dots
        return (dots > 0) ? '.'.repeat(dots) : ''
    }

    private getSpacesString(space: Space): string {
        let spaces: number = this.options.maxDots - this.options.dots
        return (spaces > 0) ? space.repeat(spaces) : ''
    }

    private getContent(space: Space) {
        const dots: string = this.getDotsString()
        const spaces: string = this.getSpacesString(space)
        return `${this.options.phrase}${dots}${spaces}`
    }

    public getText = (): string => this.getContent(Space.Text)

    public getHTML = (): string => this.getContent(Space.HTML)

    public run = (ms: number, options?: WatermarkOptions): Required<WatermarkOptions> => {
        if (this.running) {
            throw new Error('Watermark is already running!')
        }

        const clonedOptions: Required<WatermarkOptions> = Object.assign({}, this.options)

        if (options !== undefined) {
            this.setOptions(options)
        }

        const tick = (): void => {
            const dots: number = (this.getDots() < this.getMaxDots()) ? this.getDots() + 1 : 0
            this.setDots(dots)
        }

        this.intervalID = window.setInterval(tick, ms)
        this.running = true

        return clonedOptions
    }

    public stop = (options?: WatermarkOptions): Required<WatermarkOptions> => {
        if (!this.running) {
            throw new Error('Watermark is not running!')
        }

        window.clearInterval(this.intervalID)
        this.running = false

        const clonedOptions: Required<WatermarkOptions> = Object.assign({}, this.options)

        if (options !== undefined) {
            this.setOptions(options)
        }

        return clonedOptions
    }

    public update = (): void => {
        setElemValue(
            this.getElem(),
            {
                innerHTML: this.getHTML(),
            },
        )
    }
}
