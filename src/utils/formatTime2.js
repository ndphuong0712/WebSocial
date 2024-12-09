const formatTime2 = (dateISO) => {
  if (dateISO === null) return ""
  const date = new Date(dateISO)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`
}

export default formatTime2
