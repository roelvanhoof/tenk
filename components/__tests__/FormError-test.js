import * as React from 'react'
import renderer from 'react-test-renderer'

import { act } from 'react-native-testing-library'
import FormError from '../FormError'

describe('FormError', () => {
  it(`renders correctly`, async () => {
    await act(async () => {
      const tree = await renderer.create(<FormError>Test</FormError>).toJSON()
      await expect(tree).toMatchSnapshot()
    })
  })
})
