import logger from './logger'

export const groupBy = <T, K>(items: T[], f: (t: T) => K): Map<K, T[]> =>
  items.reduce((acc, item) => {
    const key = f(item)
    if (acc.has(key)) {
      acc.get(key).push(item)
    } else {
      acc.set(key, [item])
    }
    return acc
  }, new Map<K, T[]>())

export { logger }
