import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import HospitalVisit from 'App/Models/Medical/HospitalVisit'
import UpdateHospitalVisitValidator from 'App/Validators/Medical/UpdateHospitalVisitValidator'
import Record from './Record'

export default class Update {
  async handle(
    id,
    data: typeof UpdateHospitalVisitValidator.props,
    auth: AuthContract
  ) {
    var hospitalVisit = await HospitalVisit.query()
      .apply((scopes) => scopes.byUser(auth?.user))
      .where('id', id)
      .firstOrFail()

    for (const key in data) {
      if (
        [
          'summary',
          'date',
          'vitals',
          'userId',
          'doctorId',
          'hospitalId'
        ].includes(key)
      )
        hospitalVisit[key] =
          typeof data[key] !== 'undefined' ? data[key] : data[key]
    }

    await hospitalVisit.save()

    return {
      hospitalVisit: await HospitalVisit.findOrFail(id),
      vitals: await new Record().recordVitals(data.vitals || [], hospitalVisit)
    }
  }
}
