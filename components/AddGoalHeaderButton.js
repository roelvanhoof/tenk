import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-elements'

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    right: 16,
  },
})

export default function AddGoalHeaderButton({ navigation }) {
  return (
    <View style={styles.iconContainer}>
      <Icon
        name="md-add"
        type="ionicon"
        color="rgb(0, 122, 255)"
        onPress={() => navigation.navigate('GoalsCreate')}
        testID="button"
      />
    </View>
  )
}
