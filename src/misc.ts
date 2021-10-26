export type Chars = {
    correct: number
    incorrect: number
    extra: number
    missed: number
}

export type Data = {
    wpm: number
    cpm: number
    acc: number
    testType: string[]
    raw: number
    chars: Chars
    const: number
    key: number
    time: number
    afk: number
}

export type ElemAttrs = {
    [key: string]: string | null
}

export type ElemValue = {
    innerHTML: string
    innerText: string
    attrs: ElemAttrs
}


export enum ElemName {
    Result,
    WPM,
    Crown,
    Acc,
    TestType,
    Raw,
    Chars,
    Const,
    Time,
    Source,
    LeaderboardsOuter,
    LeaderboardsInner,
    WPMChart,
    WordsHistory,
    LoginTip,
    Watermark,
    Buttons,
    NotificationCenter,
}


export type DataCollectingElemName =
    | ElemName.WPM
    | ElemName.Acc
    | ElemName.TestType
    | ElemName.Raw
    | ElemName.Chars
    | ElemName.Const
    | ElemName.Time


export const elemSelectors: {[P in ElemName]: string} = {
    [ElemName.Result]: '#result',
    [ElemName.WPM]: '#result .group.wpm .bottom',
    [ElemName.Crown]: '#result .group.wpm .top .crown',
    [ElemName.Acc]: '#result .group.acc .bottom',
    [ElemName.TestType]: '#result .group.testType .bottom',
    [ElemName.Raw]: '#result .group.raw .bottom',
    [ElemName.Chars]: '#result .group.key .bottom',
    [ElemName.Const]: '#result .group.consistency .bottom',
    [ElemName.Time]: '#result .group.time .bottom',
    [ElemName.Source]: '#result .group.source .bottom',
    [ElemName.LeaderboardsOuter]: '#result .group.leaderboards',
    [ElemName.LeaderboardsInner]: '#result .group.leaderboards .bottom',
    [ElemName.WPMChart]: '#wpmChart',
    [ElemName.WordsHistory]: '#resultWordsHistory',
    [ElemName.LoginTip]: '#result .loginTip',
    [ElemName.Watermark]: '#result .ssWatermark',
    [ElemName.Buttons]: '#result .buttons',
    [ElemName.NotificationCenter]: '#notificationCenter',
};


export const defaultElemValues: Partial<
    {[P in ElemName]: Partial<ElemValue>}
> = {
    [ElemName.Result]: {
        attrs: {'class': 'hidden'},
    },
    [ElemName.WPM]: {
        attrs: {'aria-label': ''},
        innerText: '-',
    },
    [ElemName.Acc]: {
        attrs: {'aria-label': ''},
        innerText: '-',
    },
    [ElemName.TestType]: {
        innerText: '-',
    },
    [ElemName.Raw]: {
        attrs: {'aria-label': ''},
        innerText: '-',
    },
    [ElemName.Chars]: {
        attrs: {'aria-label': 'Correct, incorrect, extra and missed'},
        innerText: '-',
    },
    [ElemName.Const]: {
        attrs: {'aria-label': ''},
        innerText: '-',
    },
    [ElemName.Time]: {
        attrs: {'aria-label': ''},
        innerText: '-',
    },
    [ElemName.Source]: {
        innerText: '-',
    },
    [ElemName.LeaderboardsInner]: {
        innerText: '-',
    },
    [ElemName.WPMChart]: {
        attrs: {
            'width': '0',
            'height': '0',
            'style': 'display: block; height: 0px; width: 0px;',
        },
    },
    [ElemName.WordsHistory]: {
        attrs: {'class': 'hidden'},
    },
    [ElemName.LoginTip]: {
        attrs: {'class': 'loginTip'},
    },
    [ElemName.Watermark]: {
        innerHTML: 'monkeytype.com',
        innerText: 'monkeytype.com',
    },
    [ElemName.Buttons]: {
        attrs: {'class': 'buttons'},
    },
    [ElemName.WordsHistory]: {
        attrs: {'class': 'hidden'},
    },
}


export const relevantDefaultStateElemNames: Partial<ElemName>[] = [
    ElemName.Result,
    ElemName.WPM,
    ElemName.Acc,
    ElemName.TestType,
    ElemName.Raw,
    ElemName.Chars,
    ElemName.Const,
    ElemName.WPMChart,
    ElemName.Watermark,
]


export const elemNamesToCollectdata: DataCollectingElemName[] = [
    ElemName.WPM,
    ElemName.Acc,
    ElemName.TestType,
    ElemName.Raw,
    ElemName.Chars,
    ElemName.Const,
    ElemName.Time,
]
