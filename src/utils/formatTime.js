const formatTime = (iso) => {
  if (!iso) return ""
  const date = new Date(iso)
  const str =
    date.toLocaleTimeString("vi").slice(0, 5) +
    " " +
    date.toLocaleDateString("vi")
  return str
}

export default formatTime
