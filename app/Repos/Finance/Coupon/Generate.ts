import Coupon from 'App/Models/Finance/Coupon'
import { DateTime } from 'luxon'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Event from '@ioc:Adonis/Core/Event'
import SubscriptionPlan from 'App/Models/Finance/SubscriptionPlan'

export default class Generate {
  async handle(
    {
      subscriptionPlanId,
      numberOfCoupons,
      daysToExpiry,
      prefix,
      suffix
    }: {
      subscriptionPlanId: number
      numberOfCoupons: number
      daysToExpiry: number
      prefix?: string
      suffix?: string
    },
    auth: AuthContract
  ) {
    var codes = new Array()

    do {
      const code = `${prefix ? prefix : ''}${Math.random()
        .toString(36)
        .slice(9)
        .toLocaleUpperCase()}${suffix ? suffix : ''}`
      codes.push(code)
    } while (codes.length < numberOfCoupons)

    const coupons = await Coupon.createMany(
      codes.map((code) => ({
        code,
        subscriptionPlanId,
        expiresAt: DateTime.local().plus({ days: daysToExpiry }),
        createdBy: auth.user?.id
      }))
    )

    if (auth.user) {
      const subscriptionPlan = await SubscriptionPlan.findOrFail(
        subscriptionPlanId
      )
      Event.emit('coupons/genrated', {
        coupons,
        subscriptionPlan,
        user: auth.user
      })
    }

    return coupons
  }
}
