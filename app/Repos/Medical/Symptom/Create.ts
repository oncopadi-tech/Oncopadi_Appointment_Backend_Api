import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { getRoleCodes, slugify } from 'App/Helpers/Index'
import Symptom from 'App/Models/Medical/Symptom'
import StoreSymptomValidator from 'App/Validators/Medical/StoreSymptomValidator'
import { Exception } from '@poppinss/utils'
import Specialty from 'App/Models/Medical/Specialty'
import User from 'App/Models/People/User'

export default class Create {
  public async handle(
    { symptoms, date, userId, cancerType }: typeof StoreSymptomValidator.props,
    auth?: AuthContract
  ) {
    if (typeof userId === 'undefined') {
      userId = auth?.user?.id || 0
    } else {
      const roleCodes = getRoleCodes(auth?.user)
      if (
        ['administrator', 'doctor'].filter((role) =>
          roleCodes.find((code) => code === role)
        ).length < 1
      ) {
        throw new Exception(
          'you are not allowed track symptoms for this user',
          403
        )
      }
    }

    var specialtyId: number
    const user = await User.findOrFail(userId)

    if (typeof cancerType !== 'undefined') {
      const specialty = await Specialty.firstOrCreate(
        { code: slugify(cancerType) },
        { name: cancerType }
      )
      specialtyId = specialty.id
    } else {
      specialtyId = user.cancerTypeId
    }

    const symptom = await Symptom.create({
      symptoms,
      date,
      userId,
      createdBy: auth?.user?.id || 0,
      specialtyId: specialtyId
    })

    return symptom
  }
}
