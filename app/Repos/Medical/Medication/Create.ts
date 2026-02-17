import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import StoreMedicationValidator from 'App/Validators/Medical/StoreMedicationValidator'
import { Exception } from '@poppinss/utils'
import { getRoleCodes } from 'App/Helpers/Index'
import Medication from 'App/Models/Medical/Medication'

export default class Create {
  async handle(
    { medications, userId }: typeof StoreMedicationValidator.props,
    auth: AuthContract
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

    medications = medications.map((medication) => ({ ...medication, userId }))

    return await Medication.createMany(medications)
  }
}
