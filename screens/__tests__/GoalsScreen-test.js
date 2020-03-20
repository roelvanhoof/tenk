import * as React from 'react'
import renderer from 'react-test-renderer'
import { render, act, fireEvent, cleanup } from 'react-native-testing-library'

import { AsyncStorage } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import GoalsScreen from '../GoalsScreen'

const GoalsStack = createStackNavigator()

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
          id: '1',
          name: 'Learn French',
          hours: 1000,
          spent: 300 * 3600,
        },
        {
          id: '2',
          name: 'Play Guitar',
          hours: 10000,
          spent: 4000 * 3600,
        },
      ]
      resolve(JSON.stringify(goals))
    })
  }),
}))

afterEach(() => {
  jest.clearAllMocks()
  cleanup()
})

describe('GoalsScreen', () => {
  it(`renders correctly`, async () => {
    const container = (
      <NavigationContainer>
        <GoalsStack.Navigator>
          <GoalsStack.Screen name="Goals" component={GoalsScreen} />
        </GoalsStack.Navigator>
      </NavigationContainer>
    )
    await act(async () => {
      const tree = await renderer.create(container).toJSON()
      await expect(tree).toMatchSnapshot()
    })
  })
  it(`shows the goals and hides the intro when there are goals`, async () => {
    const { queryByTestId, getByTestId } = render(
      <NavigationContainer>
        <GoalsStack.Navigator>
          <GoalsStack.Screen name="Goals" component={GoalsScreen} />
        </GoalsStack.Navigator>
      </NavigationContainer>
    )

    await act(async () => {
      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await expect(queryByTestId('intro')).toBeNull()
      await expect(getByTestId('goalList').props.items.length).toEqual(2)
    })
  })
  it(`shows the intro when there are no goals`, async () => {
    AsyncStorage.getItem = jest.fn(() => {
      return new Promise(resolve => resolve([]))
    })
    const { getByTestId } = render(
      <NavigationContainer>
        <GoalsStack.Navigator>
          <GoalsStack.Screen name="Goals" component={GoalsScreen} />
        </GoalsStack.Navigator>
      </NavigationContainer>
    )

    await act(async () => {
      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await expect(getByTestId('intro')).toBeTruthy()
      await expect(getByTestId('goalList').props.items.length).toEqual(0)
    })
  })
  it(`can navigate to the 'goal create' screen via the button in the intro text`, async () => {
    AsyncStorage.getItem = jest.fn(() => {
      return new Promise(resolve => resolve([]))
    })
    const GoalCreateScreen = () => {
      return <React.Fragment />
    }
    const { getByTestId } = render(
      <NavigationContainer>
        <GoalsStack.Navigator>
          <GoalsStack.Screen name="Goals" component={GoalsScreen} />
          <GoalsStack.Screen name="GoalsCreate" component={GoalCreateScreen} />
        </GoalsStack.Navigator>
      </NavigationContainer>
    )

    await act(async () => {
      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await fireEvent.press(getByTestId('goalCreateButton'))
    })
  })
})
