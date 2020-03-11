import * as React from 'react'
import renderer from 'react-test-renderer'
import { render, fireEvent } from 'react-native-testing-library'

import AddGoalHeaderButton from '../AddGoalHeaderButton'

describe('AddGoalHeaderButton', () => {
  it(`renders correctly`, () => {
    const tree = renderer.create(<AddGoalHeaderButton />).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('navigates to GoalCreate screen when pressed', () => {
    const navigation = { navigate: jest.fn() }
    const { getByTestId } = render(
      <AddGoalHeaderButton navigation={navigation} />
    )
    fireEvent.press(getByTestId('button'))
    expect(navigation.navigate).toBeCalledWith('GoalsCreate')
  })
})
