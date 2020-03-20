import * as React from 'react'
import renderer from 'react-test-renderer'
import { render, fireEvent, act } from 'react-native-testing-library'

import GoalListItem from '../GoalListItem'

describe('GoalListItem', () => {
  it(`renders correctly when hours equals 10 000`, async () => {
    const goal = {
      id: '123',
      name: 'Learn French',
      hours: 10000,
      spent: 4000 * 3600,
    }
    const navigation = { navigate: jest.fn() }
    const tree = renderer
      .create(<GoalListItem goal={goal} navigation={navigation} />)
      .toJSON()
    await act(async () => {
      await expect(tree).toMatchSnapshot()
    })
  })
  it(`renders correctly when spent > hours`, async () => {
    const goal = {
      id: '123',
      name: 'Learn French',
      hours: 10000,
      spent: 10001 * 3600,
    }
    const navigation = { navigate: jest.fn() }
    const tree = renderer
      .create(<GoalListItem goal={goal} navigation={navigation} />)
      .toJSON()
    await act(async () => {
      await expect(tree).toMatchSnapshot()
    })
  })
  it(`navigates to GoalDetail screen with goalId`, async () => {
    const goal = {
      id: '123',
      name: 'Learn French',
      hours: 10000,
      spent: 4000 * 3600,
    }
    const navigation = { navigate: jest.fn() }
    const { getByTestId } = render(
      <GoalListItem goal={goal} navigation={navigation} />
    )
    await act(async () => {
      await fireEvent.press(getByTestId('button'))
      await expect(navigation.navigate).toBeCalledWith('GoalDetails', {
        goalId: goal.id,
      })
    })
  })
})
