function formatTimeString(time) {
  let seconds = Math.floor(time / 1000)
  let minutes = Math.floor(time / 60000)
  const hours = Math.floor(time / 3600000)
  seconds -= minutes * 60
  minutes -= hours * 60
  const formatted = `${hours < 10 ? 0 : ''}${hours}:${
    minutes < 10 ? 0 : ''
  }${minutes}:${seconds < 10 ? 0 : ''}${seconds}`

  return formatted
}

export { formatTimeString }
