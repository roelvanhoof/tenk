import * as React from 'react'
import {
  View,
  Text,
  StyleSheet,
  AppState,
  Alert,
  AsyncStorage,
} from 'react-native'
import { Timer } from 'react-native-stopwatch-timer'
import { Button } from 'react-native-elements'
import TimePicker from 'react-native-simple-time-picker'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'

const options = {
  container: {
    marginTop: 64,
    alignSelf: 'center',
  },
  text: {
    fontSize: 74,
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  timerContainer: {
    height: 300,
    paddingTop: 50,
    paddingBottom: 30,
  },
  button: {
    width: 140,
    marginBottom: 16,
    alignSelf: 'center',
  },
  text: {
    marginTop: 100,
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

export default function GoalTimerScreen({ route, navigation }) {
  const { goal } = route.params

  const [timerRunning, setTimerRunning] = React.useState(false)
  const [timerPaused, setTimerPaused] = React.useState(false)
  const [timerReset, setTimerReset] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const [time, setTime] = React.useState(0)

  navigation.setOptions({
    headerTitle: goal.name,
    headerBackTitle: 'Back',
  })

  async function getiOSNotificationPermission() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    if (status !== 'granted') {
      await Permissions.askAsync(Permissions.NOTIFICATIONS)
    }
  }

  React.useEffect(() => {
    getiOSNotificationPermission()
  })

  async function addTimeToGoal(seconds) {
    try {
      const goalsString = (await AsyncStorage.getItem('@goals')) || '[]'
      const goals = JSON.parse(goalsString)
      for (let i = 0; i < goals.length; i += 1) {
        if (goals[i].id === goal.id) {
          goals[i].spent += seconds
        }
      }
      await AsyncStorage.setItem('@goals', JSON.stringify(goals))
      navigation.goBack()
    } catch (e) {
      // console.error(e)
    }
  }

  function toggleTimer() {
    if (timerRunning) {
      setTimerRunning(false)
      setTimerPaused(true)
    } else if (duration > 0) {
      setTimerRunning(true)
      setTimerPaused(false)
    }
  }

  function resetTimer() {
    setTimerRunning(false)
    setTimerPaused(false)
    setTimerReset(true)
    setDuration(0)
  }

  function handleTimerComplete() {
    if (AppState.currentState.match(/inactive|background/)) {
      const localNotification = {
        title: 'Tenk Timer Finished',
        body: `Time has been added towards the goal "${goal.name}"`,
        android: {
          sound: true,
        },
        ios: {
          sound: true,
        },
      }
      Notifications.presentLocalNotificationAsync(localNotification)
    } else {
      Alert.alert(
        'Update Goal?',
        `Do you want to add ${time} towards goal "${goal.name}"`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              resetTimer()
              addTimeToGoal()
            },
          },
        ]
      )
    }
    addTimeToGoal(duration / 1000)
  }

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        {!timerRunning && !timerPaused && (
          <TimePicker
            selectedHours={0}
            selectedMinutes={0}
            hoursUnit=" hours"
            minutesUnit=" min"
            onChange={(hours, minutes) =>
              setDuration((hours * 3600 + minutes * 60) * 1000)
            }
          />
        )}
        {duration > 0 && (timerRunning || timerPaused) && (
          <Timer
            totalDuration={duration}
            start={timerRunning}
            reset={timerReset}
            options={options}
            handleFinish={handleTimerComplete}
            getTime={setTime}
          />
        )}
      </View>
      <Button
        title={!timerRunning ? 'Start' : 'Pause'}
        onPress={toggleTimer}
        style={styles.button}
      />
      <Button title="Reset" onPress={resetTimer} style={styles.button} />
      <Text style={styles.text}>
        Start the timer and start working on you goal.
      </Text>
      <Text style={styles.text2}>
        When the timer ends the time will be added towards completing your goal.
      </Text>
      <Text style={styles.text3}>Good luck, you can do it!</Text>
    </View>
  )
}
