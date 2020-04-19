import * as React from 'react'

import { AsyncStorage } from 'react-native'

import GoalForm from '../components/GoalForm'

async function addGoal(formValues, navigation) {
  const goalsString = (await AsyncStorage.getItem('@goals')) || '[]'
  const goals = JSON.parse(goalsString)
  const goal = {
    id: Math.random()
      .toString(36)
      .substr(2, 9),
    name: formValues.name,
    hours: parseInt(formValues.hours, 10),
    startDate: parseInt(formValues.startDate, 10) / 1000,
    spent: parseInt(formValues.spent, 10) * 3600,
  }
  goals.push(goal)
  await AsyncStorage.setItem('@goals', JSON.stringify(goals))
  navigation.goBack()
}

export default function GoalsCreateScreen({ navigation }) {
  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: 'New Goal',
      headerBackTitle: 'Cancel',
    })
  }, [navigation])

  return <GoalForm onSubmit={addGoal} navigation={navigation} action="add" />
}
