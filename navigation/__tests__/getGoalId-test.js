import getGoalId from '../getGoalId'

describe('getGoalId', () => {
  it(`returns the goalId param`, () => {
    const route = {
      params: {
        goalId: '12345',
      },
    }
    expect(getGoalId(route)).toEqual('12345')
  })
})
