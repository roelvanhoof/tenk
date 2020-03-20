import React from 'react'
import { Text, View } from 'react-native'
import { formatTimeString } from '../lib/utils'
import useInterval from '../hooks/useInterval'

export default function Timer({
  running = false,
  options = null,
  duration = 0,
}) {
  const [remainingTime, setRemainingTime] = React.useState(duration)
  const [startTimestamp, setStartTimestamp] = React.useState(0)

  const width = 150
  const defaultStyles = {
    container: {
      backgroundColor: '#000',
      padding: 5,
      borderRadius: 5,
      width,
    },
    text: {
      fontSize: 30,
      color: '#FFF',
      marginLeft: 7,
    },
  }
  const styles = options || defaultStyles

  const startTimer = () => {
    const timestamp = Math.floor(Date.now() / 1000)
    setStartTimestamp(timestamp)
  }

  useInterval(() => {
    if (running && startTimestamp > 0) {
      const currentTimestamp = Math.floor(Date.now() / 1000)
      const timeSpend = currentTimestamp - startTimestamp
      const remaining = duration - timeSpend
      if (remaining >= 0) {
        setRemainingTime(remaining)
      }
    }
  }, 1000)

  React.useEffect(() => {
    if (running) {
      startTimer()
    }
  }, [running])

  return (
    <View style={styles.container}>
      <Text style={styles.text} testID="time">
        {formatTimeString(remainingTime * 1000)}
      </Text>
    </View>
  )
}
