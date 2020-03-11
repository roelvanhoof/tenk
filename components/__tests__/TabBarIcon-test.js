import * as React from 'react'
import renderer from 'react-test-renderer'

import TabBarIcon from '../TabBarIcon'

describe('TabBarIcon', () => {
  it(`renders icon with type correctly`, () => {
    const tree = renderer
      .create(<TabBarIcon type="feather" name="target" />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it(`renders default icon correctly with ionicon`, () => {
    const tree = renderer.create(<TabBarIcon name="md-book" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it(`renders focused icon correctly`, () => {
    const tree = renderer.create(<TabBarIcon name="md-book" focused />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
