import flattenArrays from '../../utils/flattenArrays'

describe('flattenArrays', () => {
  it('handles string values', () => {
    expect(flattenArrays({ key1: 'value1', key2: 'value2' })).toStrictEqual({ key1: 'value1', key2: 'value2' })
  })

  it('flattens Array values', () => {
    expect(flattenArrays({ key1: ['value1A', 'value1B', 'value1C'], key2: 'value2' })).toStrictEqual({
      key1: 'value1A,value1B,value1C',
      key2: 'value2',
    })
  })
})
