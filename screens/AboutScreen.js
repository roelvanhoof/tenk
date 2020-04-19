import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alinea: {
    paddingBottom: 15,
    width: 300,
  },
})

export default function AboutScreen({ navigation }) {
  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: 'About',
    })
  }, [navigation])

  return (
    <View style={styles.container} testID="aboutText">
      <Text style={styles.alinea}>
        TenK is an app to help you track the progress of your 10 000 hour goals.
      </Text>
      <Text style={styles.alinea}>
        After searching for a simple app to keep track of my progress I found
        that all the apps didn&apos;t do the simple task I wanted them to do.
      </Text>
      <Text style={styles.alinea}>
        That&apos;s when I decided to create TenK.
      </Text>
    </View>
  )
}
