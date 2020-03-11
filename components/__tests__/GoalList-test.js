import * as React from 'react'
import renderer from 'react-test-renderer'

import GoalList from '../GoalList'

describe('GoalList', () => {
  it(`renders correctly`, () => {
    const items = [
      {
        id: '123',
        name: 'Learn French',
        hours: 10000,
        spent: 4000 * 3600,
      },
      {
        id: '321',
        name: 'Guitarist',
        hours: 1000,
        spent: 200 * 3600,
      },
    ]

    const navigation = { navigate: jest.fn() }

    const tree = renderer
      .create(<GoalList items={items} navigation={navigation} />)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
