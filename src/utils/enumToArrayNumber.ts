const enumToArrayNumber = (e: any) => {
  const arr: number[] = []
  for (const i in e) {
    const num = Number(i)
    if (isFinite(num)) arr.push(num)
  }
  return arr
}

export default enumToArrayNumber
