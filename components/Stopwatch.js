import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import useInterval from '../hooks/useInterval'
import { formatTimeString } from '../lib/utils'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    width: 340,
    marginBottom: 34,
    alignSelf: 'center',
  },
  text: {
    fontSize: 74,
    color: '#000',
    marginLeft: 7,
  },
})

export default function Stopwatch({ running = false, reset = false }) {
  const [elapsed, setElapsed] = useState(0)

  useInterval(() => {
    if (reset) {
      setElapsed(0)
    }
    if (running) {
      setElapsed(elapsed + 1)
    }
  }, 1000)

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formatTimeString(elapsed * 1000)}</Text>
    </View>
  )
}
