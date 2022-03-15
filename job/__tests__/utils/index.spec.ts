import { groupBy } from '../../utils'

describe('groupBy', () => {
  it('handles empty array', () => {
    expect(groupBy([], i => i)).toStrictEqual(new Map())
  })

  it('handles single item', () => {
    expect(groupBy(['aaa'], i => i.length)).toStrictEqual(new Map([[3, ['aaa']]]))
  })

  it('handles complex example', () => {
    expect(groupBy(['aaa', 'bb', 'ccc', 'dddd', 'bb', 'bb', 'ab'], i => i.length)).toStrictEqual(
      new Map([
        [2, ['bb', 'bb', 'bb', 'ab']],
        [3, ['aaa', 'ccc']],
        [4, ['dddd']],
      ])
    )
  })
})
