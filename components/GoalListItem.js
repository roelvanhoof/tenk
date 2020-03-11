import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import Tenk from '../lib/tenk'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 14,
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd2d9',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  hours: {
    fontSize: 12,
    marginBottom: 16,
  },
  containerText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
})

function goalText(goal) {
  if (Math.round(goal.spent / 3600) >= goal.hours) {
    return 'You have mastered this goal!'
  }
  if (goal.hours === 10000) {
    return `You will become a master on ${Tenk.calculateEndDate(goal)}`
  }
  return `You will reach your goal on ${Tenk.calculateEndDate(goal)}`
}

export default function GoalListItem({ goal, navigation }) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('GoalDetails', { goalId: goal.id })
      }}
      testID="button"
    >
      <View style={styles.container}>
        <View style={styles.containerText}>
          <Text style={styles.name}>{goal.name}</Text>
          <Text style={styles.hours}>
            {Math.round(goal.spent / 3600)} / {goal.hours} hours
          </Text>
          {goal.spent > 0 && <Text style={styles.hours}>{goalText(goal)}</Text>}
          <ProgressBar
            progress={Math.round(goal.spent / 3600) / goal.hours}
            color="rgb(0, 122, 255)"
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}
