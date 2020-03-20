import React from 'react'
import { StyleSheet, Text } from 'react-native'

const styles = StyleSheet.create({
  error: {
    color: '#f00',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 8,
  },
})
export default function FormError({ children }) {
  return <Text style={styles.error}>{children}</Text>
}
