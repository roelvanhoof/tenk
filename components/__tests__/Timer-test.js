import * as React from 'react'
import renderer from 'react-test-renderer'
import { render, act } from 'react-native-testing-library'

import Timer from '../Timer'

beforeEach(() => {
  jest.useFakeTimers()
})

describe('Timer', () => {
  it(`runs the interval timer`, async () => {
    const { getByTestId } = render(<Timer running duration={3} />)
    await act(async () => {
      expect(setInterval).toBeCalledTimes(1)
      await expect(getByTestId('time').props.children).toEqual('00:00:03')
      jest.advanceTimersByTime(3000)
    })
  })
  it(`runs the interval timer even when timer is not running`, async () => {
    const { getByTestId } = render(<Timer running={false} duration={3} />)
    await act(async () => {
      expect(setInterval).toBeCalledTimes(1)
      await expect(getByTestId('time').props.children).toEqual('00:00:03')
      jest.advanceTimersByTime(3000)
    })
  })
  it(`doesn't update time if time remaining is 0`, async () => {
    const { getByTestId } = render(<Timer running duration={1} />)
    await act(async () => {
      expect(setInterval).toBeCalledTimes(1)
      await expect(getByTestId('time').props.children).toEqual('00:00:01')
      const timestamp = Date.now() + 2000
      const dateSpy = jest.spyOn(Date, 'now')
      dateSpy.mockReturnValue(timestamp)
      jest.advanceTimersByTime(1000)
    })
  })
  it(`renders correctly`, () => {
    const tree = renderer.create(<Timer />).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it(`uses the options`, () => {
    const options = {
      container: {
        marginTop: 64,
        alignSelf: 'center',
      },
    }
    const tree = renderer.create(<Timer options={options} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
