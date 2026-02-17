import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Consultation from 'App/Models/Consultation/Consultation'
import CreateConsultationValidator from 'App/Validators/Consultation/CreateConsultationValidator'
import Create from 'App/Repos/Consultation/Consultation/Create'
import UpdateConsultationValidator from 'App/Validators/Consultation/UpdateConsultationValidator'
import Update from 'App/Repos/Consultation/Consultation/Update'
import Cancel from 'App/Repos/Consultation/Consultation/Cancel'
import Join from 'App/Repos/Consultation/Consultation/Join'
import Leave from 'App/Repos/Consultation/Consultation/Leave'
import Twilio from 'App/Services/Twilio/Twillio'
import Confirm from 'App/Repos/Consultation/Consultation/Confirm'
import CtxExtendContract from 'Contracts/ctxExtend'
import End from 'App/Repos/Consultation/Consultation/End'
import Reschedule from 'App/Repos/Consultation/Consultation/Reschedule'

export default class ConsultationsController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      page = 1,
      perPage = 10000,
      statuses,
      relationships = [],
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
      userId
    } = request.get()

    var query = Consultation.query().orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    if (typeof search !== 'undefined')
      query.apply((scopes) => scopes.search(search))

    if (typeof statuses !== 'undefined')
      query.apply((scopes) => scopes.statuses(statuses))

    if (typeof userId !== 'undefined') {
      query.apply((scopes) => scopes.byUserId(userId))
    } else {
      query.apply((scopes) => scopes.byUser(auth.user))
    }

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(CreateConsultationValidator)

    const { consultation, payment } = await new Create().handle(data, auth)

    return response.json({ status: true, consultation, payment })
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = Consultation.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const consultation = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    return response.json({ status: true, consultation })
  }

  public async update({
    auth,
    params,
    request,
    response
  }: HttpContextContract) {
    const data = await request.validate(UpdateConsultationValidator)

    const consultation = await new Update().handle(params.id, data, auth)

    return response.json({ status: true, consultation })
  }

  public async cancel({ auth, params, response }: HttpContextContract) {
    const consultation = await new Cancel().handle(params.id, auth)

    return response.json({ status: true, consultation })
  }

  public async confirm({ auth, params, response }: HttpContextContract) {
    const consultation = await new Confirm().handle(params.id, auth)

    return response.json({ status: true, consultation })
  }

  public async join({ auth, params, response, validator }: CtxExtendContract) {
    const data = await validator.validate({
      relationships: validator.schema.array
        .optional()
        .members(validator.schema.string())
    })

    const consultation = await new Join().handle(params.id, data, auth)

    const { token, twilioRoom } = await new Twilio().getToken({
      consultation,
      user: auth.user
    })

    return response.json({
      status: true,
      consultation,
      twilioRoom,
      twilioToken: token
    })
  }

  public async reschedule({
    auth,
    params,
    request,
    response
  }: HttpContextContract) {
    const data = await request.validate(UpdateConsultationValidator)

    const consultation = await new Reschedule().handle(params.id, data, auth)

    return response.json({ status: true, consultation })
  }

  public async leave({ auth, params, response }: HttpContextContract) {
    const consultation = await new Leave().handle(params.id, auth)

    return response.json({ status: true, consultation })
  }

  public async end({ auth, params, response }: HttpContextContract) {
    const consultation = await new End().handle(params.id, auth)

    return response.json({ status: true, consultation })
  }
}
