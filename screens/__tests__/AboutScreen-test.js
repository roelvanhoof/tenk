import * as React from 'react'
import renderer from 'react-test-renderer'

import AboutScreen from '../AboutScreen'

describe('AboutScreen', () => {
  it(`renders correctly`, () => {
    const navigation = {
      navigate: jest.fn(),
      setOptions: jest.fn(),
    }
    const tree = renderer
      .create(<AboutScreen navigation={navigation} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
