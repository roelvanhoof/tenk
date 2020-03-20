import * as React from 'react'
import renderer from 'react-test-renderer'
import { Platform, AsyncStorage } from 'react-native'
import {
  render,
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library'

import GoalsCreateScreen from '../GoalsCreateScreen'

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

jest.mock('react-native/Libraries/Storage/AsyncStorage', () => ({
  setItem: jest.fn(() => {
    return new Promise(resolve => {
      resolve(null)
    })
  }),
  getItem: jest.fn(() => {
    return new Promise(resolve => {
      resolve(null)
    })
  }),
}))

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker')

afterEach(() => {
  jest.clearAllMocks()
})

describe('GoalsCreateScreen', () => {
  const navigation = {
    navigate: jest.fn(),
    setOptions: jest.fn(),
    goBack: jest.fn(),
  }
  it(`renders correctly`, () => {
    const tree = renderer
      .create(<GoalsCreateScreen navigation={navigation} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
  it(`can add a goal`, async () => {
    const { getByTestId } = render(
      <GoalsCreateScreen navigation={navigation} />
    )

    await act(async () => {
      await fireEvent.changeText(getByTestId('name'), 'test goal')
      await fireEvent(getByTestId('name'), 'blur')

      await fireEvent.changeText(getByTestId('hours'), '10000')
      await fireEvent(getByTestId('hours'), 'blur')

      await fireEvent.changeText(getByTestId('spent'), '3000')
      await fireEvent(getByTestId('spent'), 'blur')

      if (Platform.OS === 'android') {
        await fireEvent.press(getByTestId('androidStartDateButton'))
      }

      const someTimeAgo = new Date(Date.UTC('2018', '01', '01'))
      await fireEvent(
        getByTestId('dateTimePicker'),
        'onChange',
        null,
        someTimeAgo
      )

      await fireEvent.press(getByTestId('addGoalButton'))

      await flushMicrotasksQueue()

      await expect(AsyncStorage.getItem).toBeCalledTimes(1)
      await expect(AsyncStorage.setItem).toBeCalledTimes(1)
      await expect(navigation.goBack).toBeCalled()
    })
  })
})
