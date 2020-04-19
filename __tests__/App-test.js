import * as React from 'react'
import * as Sentry from 'sentry-expo'
import renderer from 'react-test-renderer'
import {
  act,
  cleanup,
  flushMicrotasksQueue,
  render,
  fireEvent,
} from 'react-native-testing-library'
import { AsyncStorage } from 'react-native'

import App from '../App'

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

jest.mock('@react-navigation/native/lib/commonjs/useLinking', () => {
  return jest.fn(() => {
    return { getInitialState: jest.fn() }
  })
})

jest.mock('sentry-expo', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
}))

afterEach(() => {
  jest.clearAllMocks()
  cleanup()
})

describe('App', () => {
  it(`renders correctly`, async () => {
    const tree = renderer.create(<App />).toJSON()
    await act(async () => {
      expect(tree).toMatchSnapshot()
    })
  })
  it(`renders the intro on first run`, async () => {
    const { getByTestId } = render(<App />)
    await act(async () => {
      await flushMicrotasksQueue()
      await expect(getByTestId('screen1')).toBeTruthy()
    })
  })
  it(`sends exceptions to sentry`, async () => {
    const spy = jest.spyOn(AsyncStorage, 'getItem').mockImplementation(() => {
      throw new Error('testing sentry')
    })
    render(<App />)
    await act(async () => {
      await flushMicrotasksQueue()
      expect(Sentry.captureException).toBeCalledTimes(1)
    })
    spy.mockRestore()
  })
  it(`can click through the intro and go to the goals screen when done`, async () => {
    const { getByTestId, getByText } = render(<App />)
    await act(async () => {
      await flushMicrotasksQueue()
      await expect(getByTestId('screen1')).toBeTruthy()
      await fireEvent.press(getByText('Next'))
      await fireEvent.press(getByText('Next'))
      await fireEvent.press(getByText('Next'))
      await fireEvent.press(getByText('Next'))
      await fireEvent.press(getByText('Done'))
      await expect(getByTestId('intro')).toBeTruthy()
    })
  })
  it(`skips the app intro when app has ran before`, async () => {
    const spy = jest.spyOn(AsyncStorage, 'getItem').mockImplementation(() => {
      return 'true'
    })
    const { getByTestId } = render(<App />)
    await act(async () => {
      await flushMicrotasksQueue()
      await expect(getByTestId('goalList')).toBeTruthy()
    })
    spy.mockRestore()
  })
  it(`can use the bottom navigator to switch between the goals and about screens`, async () => {
    const spy = jest.spyOn(AsyncStorage, 'getItem').mockImplementation(() => {
      return 'true'
    })
    const { getByTestId } = render(<App />)
    await act(async () => {
      await flushMicrotasksQueue()
      await expect(getByTestId('goalList')).toBeTruthy()
      await fireEvent.press(getByTestId('aboutBottomBarIcon'))
      await expect(getByTestId('aboutText')).toBeTruthy()
      await fireEvent.press(getByTestId('goalsBottomBarIcon'))
      await expect(getByTestId('goalList')).toBeTruthy()
    })
    spy.mockRestore()
  })
})
