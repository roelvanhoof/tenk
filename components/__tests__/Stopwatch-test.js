import * as React from 'react'
import renderer from 'react-test-renderer'
import { act, cleanup } from 'react-native-testing-library'

import Stopwatch from '../Stopwatch'

beforeEach(() => {
  jest.useFakeTimers()
  cleanup()
})

describe('Stopwatch', () => {
  it(`renders correctly`, async () => {
    const tree = renderer.create(<Stopwatch />).toJSON()
    await act(async () => {
      await expect(tree).toMatchSnapshot()
    })
  })
  it(`renders a running stopwatch correctly`, async () => {
    const tree = renderer.create(<Stopwatch running />).toJSON()
    await act(async () => {
      await expect(tree).toMatchSnapshot()
    })
  })
  it(`renders a resetted stopwatch correctly`, async () => {
    const tree = renderer.create(<Stopwatch reset />).toJSON()
    await act(async () => {
      await expect(tree).toMatchSnapshot()
    })
  })
})
