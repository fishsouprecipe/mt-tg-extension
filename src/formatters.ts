import { ElemValue, ElemName, Data, DataCollectingElemName} from './misc'


export type FormatterMap<P extends DataCollectingElemName> =
    | P extends ElemName.WPM ? 'wpm' | 'cpm'
    : P extends ElemName.Acc ? 'acc'
    : P extends ElemName.TestType ? 'testType'
    : P extends ElemName.Raw ? 'raw'
    : P extends ElemName.Chars ? 'chars'
    : P extends ElemName.Const ? 'const' | 'key'
    : P extends ElemName.Time ? 'time' | 'afk'
    : never

export type FormatterData<P extends DataCollectingElemName> = Pick<Data, FormatterMap<P>>

interface IFormatter<I extends DataCollectingElemName> {
    format(elemValue: ElemValue): FormatterData<I>
}


class WPMFormatter implements IFormatter<ElemName.WPM> {
    public format = (elemValue: ElemValue): FormatterData<ElemName.WPM> => {
        const ariaLabel: string = elemValue.attrs['aria-label']
        const re: RegExp = /^(?<wpm>(\d+.\d+|\d+))\s\((?<cpm>(\d+.\d+|\d+))\scpm\)$/

        const exec = re.exec(ariaLabel)

        return {
            wpm: Number.parseFloat(exec.groups.wpm),
            cpm: Number.parseFloat(exec.groups.cpm),
        }
    }
}


class AccFormatter implements IFormatter<ElemName.Acc> {
    public format = (elemValue: ElemValue): FormatterData<ElemName.Acc> => {
        const ariaLabel: string = elemValue.attrs['aria-label']
        const re: RegExp = /^(?<acc>(\d+.\d+|\d+))%$/

        const exec = re.exec(ariaLabel)

        return {
            acc: Number.parseFloat(exec.groups.acc)
        }
    }
}


class TestTypeFormatter implements IFormatter<ElemName.TestType> {
    public format = (
        elemValue: ElemValue,
): FormatterData<ElemName.TestType> => {
        const innerText: string = elemValue.innerText.trim()
        const re: RegExp = /\n/
        const result: string[] = []

        for (const item of innerText.split(re)) {
            result.push(item.trim())
        }

        return {
            testType: result
        }
    }
}



class RawFormatter implements IFormatter<ElemName.Raw> {
    public format = (
        elemValue: ElemValue,
): FormatterData<ElemName.Raw> => {
        const ariaLabel: string = elemValue.attrs['aria-label']
        const re: RegExp = /^(?<raw>(\d+.\d+|\d+))$/
        const exec = re.exec(ariaLabel)

        return {
            raw: Number.parseFloat(exec.groups.raw),
        }
    }
}


class CharsFormatter implements IFormatter<ElemName.Chars> {
    public format = (
        elemValue: ElemValue,
): FormatterData<ElemName.Chars> => {
        const innerText: string = elemValue.innerText.trim()
        const re: RegExp = /^(?<correct>\d+)\/(?<incorrect>\d+)\/(?<extra>\d+)\/(?<missed>\d+)$/

        const exec = re.exec(innerText)

        const chars = {
            correct: Number.parseInt(exec.groups.correct),
            incorrect: Number.parseInt(exec.groups.incorrect),
            extra: Number.parseInt(exec.groups.extra),
            missed: Number.parseInt(exec.groups.missed),
        }

        return {
            chars: chars
        }
    }
}


class ConstFormatter implements IFormatter<ElemName.Const> {
    public format = (
        elemValue: ElemValue,
): FormatterData<ElemName.Const> => {
        const ariaLabel: string = elemValue.attrs['aria-label']
        const re: RegExp = /^(?<const>(\d+.\d+|\d+))%\s\((?<key>(\d+.\d+|\d+))%\skey\)$/
        const exec = re.exec(ariaLabel)

        return {
            const: Number.parseFloat(exec.groups.const),
            key: Number.parseFloat(exec.groups.key),
        }
    }
}


class TimeFormatter implements IFormatter<ElemName.Time> {
    public format = (
        elemValue: ElemValue,
): FormatterData<ElemName.Time> => {
        const ariaLabel: string = elemValue.attrs['aria-label']
        const re: RegExp = /^(?<time>(\d+.\d+|\d+))s\s\((?<afk>(\d+.\d+|\d+))s\safk.*\)$/
        const exec = re.exec(ariaLabel)

        return {
            time: Number.parseFloat(exec.groups.time),
            afk: Number.parseFloat(exec.groups.afk),
        }
    }
}

export const formatters: {
    [P in DataCollectingElemName]: IFormatter<P>
} = {
    [ElemName.WPM]: new WPMFormatter(),
    [ElemName.Acc]: new AccFormatter(),
    [ElemName.TestType]: new TestTypeFormatter(),
    [ElemName.Raw]: new RawFormatter(),
    [ElemName.Chars]: new CharsFormatter(),
    [ElemName.Const]: new ConstFormatter(),
    [ElemName.Time]: new TimeFormatter(),
}
