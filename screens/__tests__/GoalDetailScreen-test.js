import * as React from 'react'
import renderer from 'react-test-renderer'
import { render, act, fireEvent, cleanup } from 'react-native-testing-library'

import { AsyncStorage } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import GoalDetailScreen from '../GoalDetailScreen'

const Stack = createStackNavigator()

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

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

jest.mock('../../navigation/getGoalId')

afterEach(() => {
  jest.clearAllMocks()
  cleanup()
})

describe('GoalDetailScreen', () => {
  it(`renders correctly`, async () => {
    const container = (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="GoalDetails" component={GoalDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
    const tree = renderer.create(container).toJSON()
    await act(async () => {
      await expect(tree).toMatchSnapshot()
    })
  })
  it(`shows the goal's stats`, async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="GoalDetails" component={GoalDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
    await act(async () => {
      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await expect(getByTestId('hours').props.children).toEqual(10000)
      await expect(getByTestId('spent').props.children).toEqual('4000h 0m 0s')
      await expect(getByTestId('left').props.children).toEqual('6000h 0m 0s')
      // await expect(getByTestId('master').props.children).toEqual(10000)
    })
  })
  it(`can navigate to stopwatch screen`, async () => {
    const GoalStopwatchScreen = () => {
      return <React.Fragment />
    }
    const { getByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="GoalDetails" component={GoalDetailScreen} />
          <Stack.Screen name="GoalStopwatch" component={GoalStopwatchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )

    await act(async () => {
      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await fireEvent.press(getByTestId('stopwatchButton'))
    })
  })
  it(`can navigate to timer screen`, async () => {
    const GoalTimerScreen = () => {
      return <React.Fragment />
    }
    const { getByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="GoalDetails" component={GoalDetailScreen} />
          <Stack.Screen name="GoalTimer" component={GoalTimerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
    await act(async () => {
      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await fireEvent.press(getByTestId('timerButton'))
    })
  })
  it(`shows a loading bar if the goal can't be found`, async () => {
    global.goalId = '321'

    const { getByTestId } = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="GoalDetails" component={GoalDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )

    await act(async () => {
      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await expect(getByTestId('loading')).toBeTruthy()
    })
  })
})
