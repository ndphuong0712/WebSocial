import { useEffect, useState } from "react"

const useDebouce = (value, time) => {
  const [debouceValue, setDebouceValue] = useState(value)

  useEffect(() => {
    const timeId = setTimeout(() => {
      setDebouceValue(value)
    }, time)
    return () => {
      clearTimeout(timeId)
    }
  }, [value])
  return debouceValue
}

export default useDebouce
