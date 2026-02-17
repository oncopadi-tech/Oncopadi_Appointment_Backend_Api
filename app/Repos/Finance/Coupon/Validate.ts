import SubscriptionPlan from 'App/Models/Finance/SubscriptionPlan'
import { Exception } from '@poppinss/utils'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { DateTime } from 'luxon'

export default class Validate {
  async handle(
    {
      couponCode,
      subscriptionPlanId
    }: {
      couponCode?: string
      subscriptionPlanId: number
    },
    auth?: AuthContract
  ) {
    const subscriptionPlan = await SubscriptionPlan.findOrFail(
      subscriptionPlanId
    )

    if (!subscriptionPlan.hasAccessCode) return subscriptionPlan

    if (typeof couponCode === 'undefined')
      throw new Exception('coupon code required', 400)

    const coupon = await subscriptionPlan
      .related('coupons')
      .query()
      .apply((scopes) => scopes.active())
      .where('code', couponCode)
      .first()

    if (!coupon) throw new Exception('invalid coupon code', 400)

    coupon.usedAt = DateTime.fromMillis(Date.now())
    coupon.usedBy = auth?.user?.id || 0
    await coupon.save()

    return subscriptionPlan
  }
}
