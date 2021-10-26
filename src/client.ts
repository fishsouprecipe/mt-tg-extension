import {
    ElemName,
    Data,
    ElemValue,
    elemSelectors,
    defaultElemValues,
    relevantDefaultStateElemNames,
    elemNamesToCollectdata,
} from './misc'
import { getElemBySelector } from './cmds/get_elem_by_selector'
import { getElemValue } from './cmds/get_elem_value'
import { setElemValue } from './cmds/set_elem_value'
import { getElemCanvas } from './cmds/get_elem_canvas'
import { getEncodedCanvas } from './cmds/get_encoded_canvas'
import { getComputedElemStyle } from './cmds/get_computed_elem_style'
import { showElem } from './cmds/show_elem'
import { hideElem } from './cmds/hide_elem'
import { ObserverHelper, ObserverHelperEventName, getObserver } from './observer_stuff'
import { Watermark, WatermarkPhrase } from './watermark';
import { waitUntil, isElemVisible } from './utils';
import { Comparator, ElemValueIsDefault } from './comparator';
import { SmokerUploader } from './uploader';
import { UploadDataStrategy } from './upload_strategies';
import { formatters } from './formatters'
import { compile } from './compiler'



const defaultValueComparator: Comparator<
    [elemValue: ElemValue, defaultElemValue: Partial<ElemValue>]
> = new Comparator(new ElemValueIsDefault())


const getElemNameByValue = (elemNameValue: ElemName): string => {
    for (const elemName in ElemName) {
        if (elemNameValue === ElemName[elemName] as unknown as ElemName) {
            return elemName
        }
    }

    throw `${elemNameValue} is not in ElemName`
}

const isOk = (): boolean => {
    for (const elemName of relevantDefaultStateElemNames) {
        const elem: HTMLElement = getElemBySelector(elemSelectors[elemName])
        const elemValue: ElemValue = getElemValue(elem)
        const defaultElemValue: Partial<ElemValue> = defaultElemValues[elemName]

        if (defaultValueComparator.compare(elemValue, defaultElemValue)) {

            console.log(getElemNameByValue(elemName))

            return false
        }
    }

    return true
}


const preScreenshot = (): void => {
    for (const elemName of [
        ElemName.Buttons,
    ElemName.LoginTip,
    ElemName.LeaderboardsOuter,
    ElemName.NotificationCenter,
    ElemName.WordsHistory,
    ]) {
        hideElem(
            getElemBySelector(elemSelectors[elemName])
        )
    }
}

const postScreenshot = (): void => {
    for (const elemName of [
        ElemName.Buttons,
    ElemName.LeaderboardsOuter,
    ]) {
        showElem(
            getElemBySelector(elemSelectors[elemName])
        )
    }
}


const setDefaultState = (): void => {
    for (const elemName of relevantDefaultStateElemNames) {
        const elem: HTMLElement = getElemBySelector(elemSelectors[elemName])
        const defaultElemValue: Partial<ElemValue> = defaultElemValues[elemName]
        setElemValue(elem, defaultElemValue)
    }
}


const collectData = (): Data => {
    const formatterDatas: Partial<Data>[] = []

    for (const elemName of elemNamesToCollectdata) {
        const elem: HTMLElement = getElemBySelector(elemSelectors[elemName])
        const elemValue: ElemValue = getElemValue(elem)
        const formatterData: Partial<Data> = formatters[elemName].format(elemValue)
        formatterDatas.push(formatterData)
    }

    return compile(formatterDatas)
}


const uploader = new SmokerUploader(new UploadDataStrategy())
const watermark: Watermark = new Watermark()
const onShow = async (): Promise<void> => {
    watermark.run(333, {dots: 0, maxDots: 3, phrase: WatermarkPhrase.Waiting})
    watermark.showElem()

    await waitUntil(isOk,
        {
            timeout: 5000,
            heartRate: 50,
        }
    )

    watermark.setPhrase(WatermarkPhrase.DataUploadingFailure)

    const data: Data = collectData()

    const resultElem: HTMLElement = getElemBySelector(elemSelectors[ElemName.Result])

    await waitUntil((): boolean => isElemVisible(resultElem),
        {
            timeout: 5000,
            heartRate: 50,
        }
    )

    const watermarkOptionsTmp = watermark.stop(
        {dots: 0, maxDots: 0, phrase: WatermarkPhrase.Default}
    )

    const style: CSSStyleDeclaration = getComputedElemStyle(document.body)
    const bgColor: string = style.getPropertyValue('--bg-color')

    preScreenshot()
    const canvas: HTMLCanvasElement = await getElemCanvas(
        resultElem,
        {
            expand: 50,
            bgColor: bgColor,
        }
    )

    const encodedCanvas: string = getEncodedCanvas(canvas)
    postScreenshot()

    watermark.run(333, {
        dots: 0,
        maxDots: watermarkOptionsTmp.maxDots,
        phrase: WatermarkPhrase.DataUploading,
    })

    await uploader.upload(data, encodedCanvas)

    watermark.stop({dots: 0, maxDots: 0, phrase: WatermarkPhrase.DataUploadingSuccess})
}

const onHide = async (): Promise<void> => {
    const resultElem: HTMLElement = getElemBySelector(elemSelectors[ElemName.Result])

    await waitUntil((): boolean => !isElemVisible(resultElem),
        {
            timeout: 5000,
            heartRate: 50,
        }
    )

    setDefaultState()

}
const onSpecificMutation = () => {
    console.log('thinking sm')
}

const observerHelper: ObserverHelper = new ObserverHelper()
observerHelper.register(ObserverHelperEventName.Show, onShow)
observerHelper.register(ObserverHelperEventName.Hide, onHide)
observerHelper.register(ObserverHelperEventName.SpecificMutation, onSpecificMutation)
const observer: MutationObserver = getObserver(observerHelper)


window.addEventListener("load", async () => {
    const resultElem: HTMLElement = getElemBySelector(elemSelectors[ElemName.Result])

    observer.observe(resultElem, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["class"],
    });

})
