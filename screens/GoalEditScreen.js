import * as React from 'react'
import { AsyncStorage, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import getGoalId from '../navigation/getGoalId'
import GoalForm from '../components/GoalForm'

export default function GoalsCreateScreen({ navigation, route }) {
  const [goal, setGoal] = React.useState(null)

  async function getGoalFromRoute() {
    const goalsString = await AsyncStorage.getItem('@goals')
    const goals = await JSON.parse(goalsString)
    const goalId = getGoalId(route)
    goals.forEach(g => {
      if (g.id === goalId) {
        setGoal(g)
      }
    })
  }

  async function editGoal(formValues) {
    const goalsString = await AsyncStorage.getItem('@goals')
    const goals = JSON.parse(goalsString)
    for (let i = 0; i < goals.length; i += 1) {
      if (goals[i].id === goal.id) {
        goals[i].name = formValues.name
        goals[i].hours = parseInt(formValues.hours, 10)
        goals[i].startDate = parseInt(formValues.startDate, 10) / 1000
        goals[i].spent = parseInt(formValues.spent, 10) * 3600
      }
    }
    await AsyncStorage.setItem('@goals', JSON.stringify(goals))
    navigation.goBack()
  }

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit Goal',
      headerBackTitle: 'Cancel',
    })
  }, [navigation])

  useFocusEffect(
    React.useCallback(() => {
      getGoalFromRoute()
    }, [navigation])
  )

  if (goal == null) {
    return <Text testID="GoalEditScreenLoading">Loading...</Text>
  }

  return (
    <GoalForm
      onSubmit={editGoal}
      navigation={navigation}
      goal={goal}
      action="edit"
    />
  )
}
