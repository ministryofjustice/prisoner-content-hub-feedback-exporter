const flattenArrays = (source: Record<string, string | string[]>): Record<string, string> =>
  Object.keys(source).reduce(
    (newSource, key) =>
      Object.assign(newSource, { [key]: Array.isArray(source[key]) ? source[key].toString() : source[key] }),
    {}
  )

export default flattenArrays
