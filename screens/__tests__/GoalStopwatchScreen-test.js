import * as React from 'react'
import renderer from 'react-test-renderer'
import {
  render,
  act,
  fireEvent,
  waitForElement,
  cleanup,
} from 'react-native-testing-library'
import { AsyncStorage, Alert } from 'react-native'

import GoalStopwatchScreen from '../GoalStopwatchScreen'

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

jest.mock('react-native/Libraries/Alert/Alert', () => {
  return {
    alert: jest.fn(),
  }
})

afterEach(() => {
  jest.clearAllMocks()
  cleanup()
})

describe('GoalStopwatchScreen', () => {
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
  it(`renders correctly`, async () => {
    await act(async () => {
      const tree = await renderer
        .create(<GoalStopwatchScreen navigation={navigation} route={route} />)
        .toJSON()
      await expect(tree).toMatchSnapshot()
    })
  })
  it(`can start/stop/reset the stopwatch`, async () => {
    const { getByText } = render(
      <GoalStopwatchScreen navigation={navigation} route={route} />
    )
    await act(async () => {
      await fireEvent.press(getByText('Start'))
      await waitForElement(() => getByText('00:00:01'))
      await fireEvent.press(getByText('Stop'))
      await fireEvent.press(getByText('Start'))
      await waitForElement(() => getByText('00:00:02'))
      await fireEvent.press(getByText('Reset'))
      await waitForElement(() => getByText('00:00:00'))
    })
  })
  it(`can add time towards a goal`, async () => {
    const { getByText } = render(
      <GoalStopwatchScreen navigation={navigation} route={route} />
    )
    await act(async () => {
      await fireEvent.press(getByText('Start'))
      await waitForElement(() => getByText('00:00:01'))
      await fireEvent.press(getByText('Stop'))
      await expect(Alert.alert).toHaveBeenCalled()
      await Alert.alert.mock.calls[0][2][1].onPress()
      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await expect(AsyncStorage.setItem).toBeCalledTimes(1)
      await expect(navigation.goBack).toBeCalled()
    })
  })
  it(`throws an exception when goal doesn't exist`, async () => {
    route.params.goal.id = 'unknown_id'
    const { getByText } = render(
      <GoalStopwatchScreen navigation={navigation} route={route} />
    )
    await act(async () => {
      await fireEvent.press(getByText('Start'))
      await fireEvent.press(getByText('Stop'))
      await expect(Alert.alert).toHaveBeenCalled()
      await expect(Alert.alert.mock.calls[0][2][1].onPress()).rejects.toThrow()
      await expect(AsyncStorage.setItem).toBeCalledTimes(0)
    })
  })
})
