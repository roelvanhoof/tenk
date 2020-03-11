export default class Tenk {
  static humanReadableHours(timestamp) {
    const hours = Math.floor(timestamp / 3600)
    const left = timestamp - hours * 3600
    const minutes = Math.floor(left / 60)
    const seconds = left - minutes * 60
    return `${hours}h ${minutes}m ${seconds}s`
  }

  static humanReadableTimestamp(timestamp) {
    const date = new Date(timestamp * 1000)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  static calculateEndDate(goal) {
    const spentHours = Math.round(goal.spent / 3600)
    const hoursLeft = goal.hours - spentHours
    const timestampToday = Math.round(Date.now() / 1000)
    const secondsTillToday = timestampToday - goal.startDate
    const daysTillToday = Math.round(secondsTillToday / 86400)
    const averageHoursPerDay = Math.round(spentHours / daysTillToday)
    const daysNeeded = Math.round(hoursLeft / averageHoursPerDay)
    const secondsNeeded = daysNeeded * 86400
    const timestampGoalCompleted = timestampToday + secondsNeeded
    return this.humanReadableTimestamp(timestampGoalCompleted)
  }
}
