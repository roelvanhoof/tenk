import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import GoalListItem from './GoalListItem'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

function renderGoalListItem(item, navigation) {
  return <GoalListItem goal={item} navigation={navigation} />
}

export default function GoalList({ items, navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => renderGoalListItem(item, navigation)}
        keyExtractor={(item, index) => item.name.concat(index.toString())}
      />
    </View>
  )
}
