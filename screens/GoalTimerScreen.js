import * as React from 'react'
import { View, Text, StyleSheet, Alert, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'
import TimePicker from 'react-native-simple-time-picker'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import useInterval from '../hooks/useInterval'
import Timer from '../components/Timer'

import { formatTimeString } from '../lib/utils'

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
    paddingBottom: 10,
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

async function getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS)
  }
}

export default function GoalTimerScreen({
  route,
  navigation,
  initialDuration = 0,
}) {
  const { goal } = route.params

  const [timerRunning, setTimerRunning] = React.useState(false)
  const [duration, setDuration] = React.useState(initialDuration)
  const [start, setStart] = React.useState(0)

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: goal.name,
      headerBackTitle: 'Back',
    })
  }, [navigation])

  React.useEffect(() => {
    getiOSNotificationPermission()
  })

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

  function openAlert(timeSpend) {
    Alert.alert(
      'Timer Finished',
      `Do you want to add ${formatTimeString(timeSpend * 1000)} towards goal "${
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
            return addTimeToGoal(timeSpend)
          },
        },
      ]
    )
  }

  function handleNotification(notification) {
    setTimerRunning(false)
    if (notification && notification.origin.match(/received|selected/)) {
      openAlert(notification.data.duration)
    }
  }

  React.useEffect(() => {
    const subscription = Notifications.addListener(handleNotification)
    return () => subscription.remove()
  }, [])

  function scheduleNotification() {
    const localNotification = {
      title: 'Tenk Timer Finished',
      body: `Timer has finihsed, open TenK to update your goal "${goal.name}"`,
      data: {
        duration,
      },
      android: {
        sound: true,
      },
      ios: {
        sound: true,
      },
    }
    const schedulingOptions = {
      time: Date.now() + duration * 1000,
    }
    Notifications.scheduleLocalNotificationAsync(
      localNotification,
      schedulingOptions
    )
  }

  function cancelScheduledNotification() {
    Notifications.cancelAllScheduledNotificationsAsync()
  }

  useInterval(() => {
    if (timerRunning) {
      const currentTimestamp = Math.floor(Date.now() / 1000)
      const timeSpend = currentTimestamp - start
      if (timeSpend >= duration) {
        setTimerRunning(false)
        cancelScheduledNotification()
        openAlert(duration)
      }
    }
  }, 100)

  function startTimer() {
    setStart(Math.floor(Date.now() / 1000))
    setTimerRunning(true)
    scheduleNotification()
  }

  function stopTimer() {
    setTimerRunning(false)
    cancelScheduledNotification()
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const timeSpend = currentTimestamp - start
    openAlert(timeSpend)
  }

  function toggleTimer() {
    if (timerRunning) {
      stopTimer()
    } else if (duration > 0) {
      startTimer()
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        {!timerRunning && (
          <TimePicker
            selectedHours={0}
            selectedMinutes={0}
            hoursUnit=" hours"
            minutesUnit=" min"
            onChange={(hours, minutes) => {
              const seconds = hours * 3600 + minutes * 60
              setDuration(seconds)
            }}
            testID="timePicker"
          />
        )}
        {duration > 0 && timerRunning && (
          <Timer duration={duration} running={timerRunning} options={options} />
        )}
      </View>
      <Button
        title={!timerRunning ? 'Start' : 'Stop'}
        onPress={() => toggleTimer()}
        style={styles.button}
      />
      <Text style={styles.text}>
        Start the timer and start working on you goal.
      </Text>
      <Text style={styles.text2}>
        When the timer ends you can choose to add the time towards completing
        your goal.
      </Text>
      <Text style={styles.text3}>Good luck, you can do it!</Text>
    </View>
  )
}
