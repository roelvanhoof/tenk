import { formatTimeString } from '../utils'

describe(`utils`, () => {
  it(`pads hours minutes and seconds with a 0 if amount is less than 10`, () => {
    let time = 9 * 3600000
    time += 9 * 60000
    time += 9000
    const formattedTime = formatTimeString(time)
    expect(formattedTime).toEqual('09:09:09')
  })
  it(`does not pad hours minutes and seconds with a 0 if amount is greater than 9`, () => {
    let time = 10 * 3600000
    time += 10 * 60000
    time += 10000
    const formattedTime = formatTimeString(time)
    expect(formattedTime).toEqual('10:10:10')
  })
})
