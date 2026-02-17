import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Coupon from 'App/Models/Finance/Coupon'
import CtxExtendContract from 'Contracts/ctxExtend'
import Generate from 'App/Repos/Finance/Coupon/Generate'

export default class CouponsController {
  public async index({ request, response }: HttpContextContract) {
    var {
      page = 1,
      perPage = 10000,
      relationships = [],
      sortBy = 'created_at',
      sortOrder = 'desc',
      subscriptionPlanIds
    } = request.get()

    var query = Coupon.query().orderBy(sortBy, sortOrder)

    if (typeof subscriptionPlanIds !== 'undefined')
      query.whereIn('subscription_plan_id', subscriptionPlanIds)

    for (const relationship of relationships) query.preload(relationship)

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, validator, response }: CtxExtendContract) {
    const data = await validator.validate({
      subscriptionPlanId: validator.schema.number(),
      numberOfCoupons: validator.schema.number(),
      daysToExpiry: validator.schema.number(),
      prefix: validator.schema.string.optional(),
      suffix: validator.schema.string.optional()
    })

    const coupons = await new Generate().handle(data, auth)

    return response.json({ status: true, coupons })
  }

  public async show({ params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = Coupon.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const coupon = await query.firstOrFail()

    return response.json({ status: true, coupon })
  }

  public async destroy({ params, response }: HttpContextContract) {
    var coupon = await Coupon.findOrFail(params.id)

    await coupon.delete()

    return response.json({ status: true, coupon })
  }
}
