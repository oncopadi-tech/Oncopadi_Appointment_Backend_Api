import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Enquiry from 'App/Models/Misc/Enquiry'
import CtxExtendContract from 'Contracts/ctxExtend'
import Create from 'App/Repos/Misc/Enquiry/Create'
import MarkAsSeen from 'App/Repos/Misc/Enquiry/MarkAsSeen'

export default class EnquiriesController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 10000,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = request.get()

    var query = Enquiry.query().orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    const results = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .whereNull('seen_at')
      .paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, response, validator }: CtxExtendContract) {
    const data = await validator.validate({
      title: validator.schema.string.optional({}, [
        validator.rules.requiredIfNotExists('message')
      ]),
      message: validator.schema.string.optional({}, [
        validator.rules.requiredIfNotExists('title')
      ]),
      email: validator.schema.string.optional({}, [validator.rules.email()]),
      replyTo: validator.schema.number.optional([
        validator.rules.exists({ column: 'id', table: 'enquiries' })
      ]),
      sentTo: validator.schema.number.optional([
        validator.rules.exists({ column: 'id', table: 'users' })
      ])
    })

    const enquiry = await new Create().handle(data, auth)

    return response.json({ status: true, enquiry })
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = Enquiry.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const enquiry = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    return response.json({ status: true, enquiry })
  }

  public async markAsSeen({ response, validator }: CtxExtendContract) {
    const data = await validator.validate({
      ids: validator.schema.array().members(validator.schema.number())
    })

    const enquiries = await new MarkAsSeen().handle(data.ids)

    return response.json({ status: true, enquiries })
  }

  public async destroy({}: HttpContextContract) {}
}
