const filterData = <T>(data: any, keys: (keyof T)[]) => {
  const result: Partial<T> = {}
  keys.forEach(key => {
    if (data[key] !== undefined) {
      result[key] = data[key]
    }
  })
  return result
}

export default filterData
