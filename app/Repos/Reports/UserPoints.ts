import User from 'App/Models/People/User'
import { loyaltyPoints } from 'Config/oncopadi'
import List from '../Shop/Order/List'

export default class UserPoints {
  async handle(userId: number) {
    const relationships = [
      'completedConsultations',
      'symptoms',
      'medications',
      'medicalConditions',
      'forums',
      'forumMessages'
    ] as any[]
    const userQuery = User.query().where('id', userId).preload('profile')
    for (const relationship of relationships)
      userQuery.withCount(relationship, (countQuery) =>
        countQuery.as(`${relationship}Count`)
      )
    const user = await userQuery.firstOrFail()

    const zeroScore = {
      score: 0,
      points: 0
    }

    var stats: { [key: string]: typeof zeroScore } = {
      bio: zeroScore,
      shop: zeroScore
    }

    for (const relationship of relationships) {
      stats[relationship] = {
        score: user.$extras[`${relationship}Count`],
        points:
          Number(user.$extras[`${relationship}Count`]) *
          loyaltyPoints[relationship]
      }
    }

    // calculate shop pints
    const { data: orders } = await new List().handle({}, { user })
    const totalSpent = orders
      .filter((order) =>
        ['completed', 'processing'].includes(order.status || '')
      )
      .reduce((total, order) => Number(order.total || 0) + total, 0)

    for (const range of loyaltyPoints.shop) {
      if (range.min <= totalSpent && range.max >= totalSpent) {
        stats.shop = {
          score: totalSpent,
          points: range.points
        }
        break
      }
    }

    // calculate bio points
    var bioComplete = true

    for (const field of [
      'image',
      'gender',
      'dateOfBirth',
      'phone',
      'name',
      'email'
    ]) {
      if (!user[field]) {
        bioComplete = false
        break
      }
    }

    if (user.profile.length < 9) bioComplete = false

    if (bioComplete) stats.bio = { score: 1, points: loyaltyPoints.bio }

    return stats
  }
}
