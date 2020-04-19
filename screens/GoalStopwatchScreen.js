import * as React from 'react'
import { View, Text, StyleSheet, Alert, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'
import Stopwatch from '../components/Stopwatch'
import { formatTimeString } from '../lib/utils'

const styles = StyleSheet.create({
  container: {
    paddingTop: 104,
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  button: {
    width: 140,
    marginBottom: 16,
    alignSelf: 'center',
  },
  text: {
    marginTop: 40,
    width: 340,
    alignSelf: 'center',
    textAlign: 'center',
  },
  text2: {
    marginTop: 16,
    width: 340,
    alignSelf: 'center',
    textAlign: 'center',
  },
  text3: {
    marginTop: 16,
    width: 340,
    alignSelf: 'center',
    textAlign: 'center',
  },
})

export default function GoalStopwatchScreen({ route, navigation }) {
  const { goal } = route.params

  const [stopwatchRunning, setStopwatchRunning] = React.useState(false)
  const [stopwatchReset, setStopwatchReset] = React.useState(false)
  const [started, setStarted] = React.useState(0)

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: goal.name,
      headerBackTitle: 'Back',
    })
  }, [goal])

  async function addTimeToGoal(seconds) {
    const goalsString = await AsyncStorage.getItem('@goals')
    const goals = JSON.parse(goalsString)
    let goalFound = false
    for (let i = 0; i < goals.length; i += 1) {
      if (goals[i].id === goal.id) {
        goals[i].spent += seconds
        goalFound = true
      }
    }
    if (!goalFound) {
      throw new Error('Goal not found')
    }
    await AsyncStorage.setItem('@goals', JSON.stringify(goals))
    navigation.goBack()
  }

  function stopped(seconds) {
    Alert.alert(
      'Update Goal?',
      `Do you want to add ${formatTimeString(seconds * 1000)} towards goal "${
        goal.name
      }"`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            setStopwatchReset(true)
            setStopwatchReset(true)
            return addTimeToGoal(seconds)
          },
        },
      ]
    )
  }

  function toggleStopwatch() {
    if (stopwatchRunning) {
      setStopwatchRunning(false)
      const timestamp = Math.floor(Date.now() / 1000)
      const elapsed = timestamp - started
      stopped(elapsed)
    } else {
      setStopwatchRunning(true)
      const timestamp = Math.floor(Date.now() / 1000)
      setStarted(timestamp)
    }
  }

  function resetStopwatch() {
    setStopwatchRunning(false)
    setStopwatchReset(true)
  }

  return (
    <View style={styles.container}>
      <Stopwatch running={stopwatchRunning} reset={stopwatchReset} />
      <Button
        title={!stopwatchRunning ? 'Start' : 'Stop'}
        onPress={toggleStopwatch}
        style={styles.button}
      />
      <Button title="Reset" onPress={resetStopwatch} style={styles.button} />
      <Text style={styles.text}>
        Start the stopwatch and start working on you goal.
      </Text>
      <Text style={styles.text2}>
        When you are finished the time will be added towards completing your
        goal.
      </Text>
      <Text style={styles.text3}>Good luck, you can do it!</Text>
    </View>
  )
}
