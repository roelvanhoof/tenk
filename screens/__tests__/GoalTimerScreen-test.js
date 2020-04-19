import * as React from 'react'
import renderer from 'react-test-renderer'
import { render, cleanup, act, fireEvent } from 'react-native-testing-library'
import { AsyncStorage, Alert } from 'react-native'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'

import GoalTimerScreen from '../GoalTimerScreen'

jest.mock('react-native/Libraries/Storage/AsyncStorage', () => ({
  setItem: jest.fn(() => {
    return new Promise(resolve => {
      resolve(null)
    })
  }),
  getItem: jest.fn(() => {
    return new Promise(resolve => {
      const goals = [
        {
          id: '123',
          name: 'Learn French',
          hours: 10000,
          spent: 4000 * 3600,
        },
      ]
      resolve(JSON.stringify(goals))
    })
  }),
}))

global.notificationListener = null

jest.mock('expo/build/Notifications/Notifications', () => {
  return {
    scheduleLocalNotificationAsync: jest.fn(),
    cancelAllScheduledNotificationsAsync: jest.fn(),
    addListener: jest.fn(listener => {
      global.notificationListener = listener
      return {
        remove: jest.fn(),
      }
    }),
  }
})

jest.mock('react-native/Libraries/Alert/Alert', () => {
  return {
    alert: jest.fn(),
  }
})

jest.mock('react-native/Libraries/AppState/AppState', () => {
  return {
    currentState: 'active',
  }
})

jest.mock('expo-permissions/build/Permissions', () => {
  return {
    getAsync: jest.fn(() => {
      return new Promise(resolve => {
        resolve({ status: 'blocked' })
      })
    }),
    askAsync: jest.fn(() => {
      return new Promise(resolve => {
        resolve(null)
      })
    }),
  }
})

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.clearAllMocks()
  cleanup()
})

describe('GoalTimerScreen', () => {
  const navigation = {
    navigate: jest.fn(),
    setOptions: jest.fn(),
    goBack: jest.fn(),
  }
  const route = {
    params: {
      goal: {
        id: '123',
        name: 'Learn french',
      },
    },
  }
  it(`renders correctly`, () => {
    const tree = renderer
      .create(<GoalTimerScreen navigation={navigation} route={route} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
  it(`removes the notification listener on cleanup`, () => {
    render(
      <GoalTimerScreen
        navigation={navigation}
        route={route}
        initialDuration={1}
      />
    )
    cleanup()
  })
  it(`can use the timer`, async () => {
    const { getByText } = render(
      <GoalTimerScreen
        navigation={navigation}
        route={route}
        initialDuration={1}
      />
    )
    await act(async () => {
      await fireEvent.press(getByText('Start'))
      const dateSpy = jest.spyOn(Date, 'now')
      dateSpy.mockReturnValue(Date.now() + 1000)
      await jest.advanceTimersByTime(1000)
      dateSpy.mockRestore()
      await expect(Alert.alert).toHaveBeenCalled()
      await Alert.alert.mock.calls[0][2][1].onPress()
      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await expect(AsyncStorage.setItem).toBeCalledTimes(1)
      await expect(navigation.goBack).toBeCalled()
    })
  })
  it(`can stop the timer`, async () => {
    const { getByText } = render(
      <GoalTimerScreen
        navigation={navigation}
        route={route}
        initialDuration={10}
      />
    )
    await act(async () => {
      await fireEvent.press(getByText('Start'))
      const dateSpy = jest.spyOn(Date, 'now')
      dateSpy.mockReturnValue(Date.now() + 1000)
      await jest.advanceTimersByTime(1000)
      dateSpy.mockRestore()
      await fireEvent.press(getByText('Stop'))
      const cancelFunction = Notifications.cancelAllScheduledNotificationsAsync
      await expect(cancelFunction).toBeCalledTimes(1)
      await expect(Alert.alert).toHaveBeenCalled()
      await Alert.alert.mock.calls[0][2][1].onPress()
      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await expect(AsyncStorage.setItem).toBeCalledTimes(1)
      await expect(navigation.goBack).toBeCalled()
    })
  })
  it(`ignores unkown notification states`, async () => {
    render(
      <GoalTimerScreen
        navigation={navigation}
        route={route}
        initialDuration={1}
      />
    )
    await act(async () => {
      const notification = {
        origin: 'unknown_state',
        data: {
          duration: 1,
          goalId: '123',
        },
      }
      global.notificationListener(notification)
      await expect(Alert.alert).not.toBeCalled()
    })
  })
  it(`won't start the timer if no time has been picked`, async () => {
    const { getByText } = render(
      <GoalTimerScreen navigation={navigation} route={route} />
    )
    await act(async () => {
      await fireEvent.press(getByText('Start'))
      await expect(getByText('Start')).toBeTruthy()
    })
  })
  it(`can change the timer time by using the picker`, async () => {
    const { getByText, getByTestId } = render(
      <GoalTimerScreen navigation={navigation} route={route} />
    )
    await act(async () => {
      await fireEvent(getByTestId('timePicker'), 'onChange', 1, 1)
      await fireEvent.press(getByText('Start'))
      await expect(getByText('01:01:00')).toBeTruthy()
    })
  })
  it(`throws an exception when goal doesn't exist`, async () => {
    const unknownRoute = {
      params: {
        goal: {
          id: 'unknown_id',
          name: 'Unknown',
        },
      },
    }
    const { getByText } = render(
      <GoalTimerScreen
        navigation={navigation}
        route={unknownRoute}
        initialDuration={1}
      />
    )
    await act(async () => {
      await fireEvent.press(getByText('Start'))
      const dateSpy = jest.spyOn(Date, 'now')
      dateSpy.mockReturnValue(Date.now() + 1000)
      await jest.advanceTimersByTime(1000)
      dateSpy.mockRestore()
      const notification = {
        origin: 'received',
        data: {
          duration: 1,
          goalId: 'unknownId',
        },
      }
      global.notificationListener(notification)
      await expect(Alert.alert).toHaveBeenCalled()
      await expect(Alert.alert.mock.calls[0][2][1].onPress()).rejects.toThrow()
      await expect(AsyncStorage.setItem).toBeCalledTimes(0)
    })
  })
  it(`asks for permissions when permission state is 'not granted'`, async () => {
    render(<GoalTimerScreen navigation={navigation} route={route} />)
    await act(async () => {
      await expect(Permissions.getAsync).toBeCalledTimes(1)
      await expect(Permissions.askAsync).toBeCalledTimes(1)
    })
  })
  it(`does not ask for permission when permission state is already 'granted'`, async () => {
    Permissions.getAsync = jest.fn(() => {
      return new Promise(resolve => {
        resolve({ status: 'granted' })
      })
    })
    render(<GoalTimerScreen navigation={navigation} route={route} />)
    await act(async () => {
      await expect(Permissions.getAsync).toBeCalledTimes(1)
      await expect(Permissions.askAsync).toBeCalledTimes(0)
    })
  })
})
