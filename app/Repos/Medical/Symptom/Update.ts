import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { slugify } from 'App/Helpers/Index'
import Specialty from 'App/Models/Medical/Specialty'
import Symptom from 'App/Models/Medical/Symptom'
import UpdateSymptomValidator from 'App/Validators/Medical/UpdateSymptomValidator'

export default class Update {
  public async handle(
    id,
    data: typeof UpdateSymptomValidator.props,
    auth?: AuthContract
  ) {
    var symptom = await Symptom.query()
      .apply((scopes) => scopes.byUser(auth?.user))
      .where('id', id)
      .firstOrFail()

    for (const key in data) {
      if (['symptoms', 'date'].includes(key))
        symptom[key] = typeof data[key] !== 'undefined' ? data[key] : data[key]
    }

    if (typeof data.cancerType !== 'undefined') {
      const specialty = await Specialty.firstOrCreate(
        { code: slugify(data.cancerType) },
        { name: data.cancerType }
      )
      symptom.specialtyId = specialty.id
    }

    await symptom.save()

    return symptom
  }
}
