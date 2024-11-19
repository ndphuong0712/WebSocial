const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[1-9])(?=.*[^a-zA-Z0-9]).{8,32}$/

const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/

const fullnameRegex = /^[\p{L}\s]{1,50}$/u

export { emailRegex, passwordRegex, usernameRegex, fullnameRegex }
