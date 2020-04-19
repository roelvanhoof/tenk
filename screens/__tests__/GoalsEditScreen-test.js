import * as React from 'react'
import renderer from 'react-test-renderer'
import {
  act,
  cleanup,
  flushMicrotasksQueue,
  render,
  fireEvent,
} from 'react-native-testing-library'
import { Alert, AsyncStorage, Platform } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import GoalEditScreen from '../GoalEditScreen'

import App from '../../App'

const Stack = createStackNavigator()

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker')

jest.mock('@react-navigation/native/lib/commonjs/useLinking', () => {
  return jest.fn(() => {
    return { getInitialState: jest.fn() }
  })
})

jest.mock('sentry-expo', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
}))

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
        {
          id: '456',
          name: 'Learn English',
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

jest.mock('../../navigation/getGoalId')

afterEach(() => {
  jest.clearAllMocks()
  cleanup()
})

function getContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="GoalEditScreen" component={GoalEditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

describe('EditGoalScreen', () => {
  it(`renders correctly`, async () => {
    await act(async () => {
      const tree = await renderer.create(getContainer()).toJSON()
      await expect(tree).toMatchSnapshot()
    })
  })
  it(`can edit a goal`, async () => {
    const { getByText, getByTestId } = render(<App skipIntro />)
    await act(async () => {
      await flushMicrotasksQueue()
      await fireEvent.press(getByText('Learn French'))
      await flushMicrotasksQueue()
      await fireEvent.press(getByText('Edit'))
      await flushMicrotasksQueue()

      await fireEvent.changeText(getByTestId('editname'), 'Edited goal')
      await fireEvent(getByTestId('editname'), 'blur')

      await fireEvent.changeText(getByTestId('edithours'), '9999')
      await fireEvent(getByTestId('edithours'), 'blur')

      await fireEvent.changeText(getByTestId('editspent'), '2000')
      await fireEvent(getByTestId('editspent'), 'blur')

      if (Platform.OS === 'android') {
        await fireEvent.press(getByTestId('editandroidStartDateButton'))
      }

      const someTimeAgo = new Date(Date.UTC('2017', '01', '01'))
      await fireEvent(
        getByTestId('editdateTimePicker'),
        'onChange',
        null,
        someTimeAgo
      )

      await fireEvent.press(getByTestId('editgoalFormSubmitButton'))

      await flushMicrotasksQueue()

      await expect(AsyncStorage.getItem).toBeCalledTimes(6)
      await expect(AsyncStorage.setItem).toBeCalledTimes(1)
    })
  })
  it(`can delete a goal`, async () => {
    const { getByText, getByTestId } = render(<App skipIntro />)
    await act(async () => {
      await flushMicrotasksQueue()
      await expect(getByTestId('goalList').props.items.length).toEqual(2)
      await fireEvent.press(getByText('Learn French'))
      await flushMicrotasksQueue()
      await fireEvent.press(getByText('Edit'))
      await flushMicrotasksQueue()
      await fireEvent.press(getByText('Delete Goal'))
      await expect(Alert.alert).toHaveBeenCalled()
      await Alert.alert.mock.calls[0][2][1].onPress()
      await expect(AsyncStorage.setItem).toBeCalledTimes(1)
    })
  })
  it(`shows a loading bar if the goal can't be found`, async () => {
    global.goalId = '321'

    const { getByTestId } = render(getContainer())

    await act(async () => {
      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await expect(getByTestId('GoalEditScreenLoading')).toBeTruthy()
    })
  })
})
