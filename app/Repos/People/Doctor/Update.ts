import UpdateUser from 'App/Repos/People/User/Update'
import Doctor from 'App/Models/People/Doctor'
import UpdateDoctorValidator from 'App/Validators/People/UpdateDoctorValidator'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'

export default class Update {
  async handle(
    id,
    data: typeof UpdateDoctorValidator.parsedSchema.props,
    auth: AuthContract
  ) {
    var doctor = await Doctor.query()
      .where('id', id)
      .orWhere('folio_number', id)
      .apply((scopes) => scopes.byUser(auth?.user))
      .firstOrFail()

    var userData: any = {}

    for (const key in data) {
      if (
        [
          'name',
          'email',
          'phone',
          'address',
          'gender',
          'dateOfBirth',
          'image'
        ].includes(key)
      ) {
        userData[key] = data[key]
      } else {
        doctor[key] = typeof data[key] !== 'undefined' ? data[key] : data[key]
      }
    }

    await doctor.save()

    await new UpdateUser().handle(doctor.userId, userData, auth)

    return doctor
  }
}
