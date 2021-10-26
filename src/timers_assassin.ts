import { getElemBySelector } from './cmds/get_elem_by_selector'
import { setElemValue } from './cmds/set_elem_value'


const timerSelectors: Readonly<string[]> = [
    '#miniTimerAndLiveWpm',
    '#timerNumber',
    '#timerWrapper',
];


window.addEventListener("load", () => {
    for (const timerSelector of timerSelectors) {
        try {
            const elem: HTMLElement = getElemBySelector(timerSelector)
            setElemValue(elem, {
                attrs: {
                    style: 'opacity: 0;'
                }
            })

        } catch {
            continue
        }

    }
})
