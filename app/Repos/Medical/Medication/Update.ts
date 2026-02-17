import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Medication from 'App/Models/Medical/Medication'
import UpdateMedicationValidator from 'App/Validators/Medical/UpdateMedicationValidator'

export default class Update {
  async handle(
    id,
    data: typeof UpdateMedicationValidator.props,
    auth: AuthContract
  ) {
    var medication = await Medication.query()
      .apply((scopes) => scopes.byUser(auth?.user))
      .where('id', id)
      .firstOrFail()

    for (const key in data) {
      if (
        [
          'name',
          'startDate',
          'reason',
          'dosage',
          'prescriber',
          'sideEfects'
        ].includes(key)
      )
        medication[key] =
          typeof data[key] !== 'undefined' ? data[key] : data[key]
    }

    await medication.save()

    return medication
  }
}
