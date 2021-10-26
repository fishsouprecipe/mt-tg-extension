import { Data } from './misc'


export const compile = (formatterDatas: Partial<Data>[]): Data => {
    return Object.assign({}, ...formatterDatas)
}
