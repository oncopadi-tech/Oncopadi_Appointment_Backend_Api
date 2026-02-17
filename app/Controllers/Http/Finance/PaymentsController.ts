import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Payment from 'App/Models/Finance/Payment'
import CtxExtendContract from 'Contracts/ctxExtend'
import Confirm from 'App/Repos/Finance/Payment/Confirm'
import Retry from 'App/Repos/Finance/Payment/Retry'

export default class PaymentsController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 10000,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = request.get()

    var query = Payment.query().orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    const results = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .paginate(page, perPage)

    return response.json(results)
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = Payment.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const payment = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    return response.json({ status: true, payment })
  }

  public async confirm({
    auth,
    params,
    response,
    validator
  }: CtxExtendContract) {
    const { method, reference } = await validator.validate({
      method: validator.schema.string(),
      reference: validator.schema.string.optional()
    })

    const payment = await new Confirm().handle(
      params.id,
      { reference, method },
      auth
    )

    return response.json({ status: true, payment })
  }

  public async retry({ params, response, validator }: CtxExtendContract) {
    const { method } = await validator.validate({
      method: validator.schema.string.optional()
    })

    const payment = await new Retry().handle({
      reference: params.reference,
      method
    })

    return response.json({
      status: true,
      payment: payment.serialize()
    })
  }
}
