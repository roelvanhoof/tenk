import * as React from 'react'
import renderer from 'react-test-renderer'
import { render, act, fireEvent } from 'react-native-testing-library'

import { AsyncStorage } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import GoalStopwatchScreen from '../GoalStopwatchScreen'

const Stack = createStackNavigator()

jest.mock('../../navigation/getGoalId')

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

beforeEach(() => {
  jest.clearAllMocks()
})

describe('GoalStopwatchScreen', () => {
  it(`renders correctly`, () => {
    // const container = (
    //   <NavigationContainer>
    //     <Stack.Navigator>
    //       <Stack.Screen name="GoalStopwatch" component={GoalStopwatchScreen} />
    //     </Stack.Navigator>
    //   </NavigationContainer>
    // )
    const navigation = {
      navigate: jest.fn(),
      setOptions: jest.fn(),
    }
    const route = {
      params: {
        goal: {
          id: '123',
          name: 'Learn french',
        },
      },
    }
    const tree = renderer
      .create(<GoalStopwatchScreen navigation={navigation} route={route} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
