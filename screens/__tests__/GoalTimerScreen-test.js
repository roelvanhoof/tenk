import * as React from 'react'
import renderer from 'react-test-renderer'
import {
  render,
  act,
  fireEvent,
  waitForElement,
} from 'react-native-testing-library'
import { AsyncStorage, Alert, AppState } from 'react-native'
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

jest.mock('expo/build/Notifications/Notifications', () => {
  return {
    presentLocalNotificationAsync: jest.fn(),
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

afterEach(() => {
  jest.clearAllMocks()
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
  it(`can use the timer`, async () => {
    const { getByText } = render(
      <GoalTimerScreen
        navigation={navigation}
        route={route}
        initialDuration={1000}
      />
    )
    await act(async () => {
      await fireEvent.press(getByText('Start'))
      await expect(getByText('00:00:01')).toBeTruthy()
      await waitForElement(() => getByText('00:00:00'))
      await expect(Alert.alert).toHaveBeenCalled()
      await Alert.alert.mock.calls[0][2][1].onPress()
      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await expect(AsyncStorage.setItem).toBeCalledTimes(1)
      await expect(navigation.goBack).toBeCalled()
    })
  })
  it(`can pause the timer`, async () => {
    const { getByText } = render(
      <GoalTimerScreen
        navigation={navigation}
        route={route}
        initialDuration={5000}
      />
    )
    await act(async () => {
      await fireEvent.press(getByText('Start'))
      await expect(getByText('00:00:05')).toBeTruthy()
      await fireEvent.press(getByText('Pause'))
      await expect(getByText('Start')).toBeTruthy()
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
        initialDuration={1000}
      />
    )
    await act(async () => {
      await fireEvent.press(getByText('Start'))
      await waitForElement(() => getByText('00:00:00'))
      await expect(Alert.alert).toHaveBeenCalled()
      await expect(Alert.alert.mock.calls[0][2][1].onPress()).rejects.toThrow()
      await expect(AsyncStorage.setItem).toBeCalledTimes(0)
    })
  })
  it(`pushes a notification when timer is finished and app is in the background`, async () => {
    AppState.currentState = 'inactive'
    const { getByText } = render(
      <GoalTimerScreen
        navigation={navigation}
        route={route}
        initialDuration={1000}
      />
    )
    await act(async () => {
      await fireEvent.press(getByText('Start'))
      await waitForElement(() => getByText('00:00:00'))
      await expect(Notifications.presentLocalNotificationAsync).toBeCalledTimes(1)
    })
  })
  it(`asks for permissions when permission state is 'not granted'`, async () => {
    render(<GoalTimerScreen navigation={navigation} route={route} />)
    await act(async () => {
      await expect(Permissions.getAsync).toBeCalledTimes(1)
      await expect(Permissions.askAsync).toBeCalledTimes(1)
    })
  })
})
