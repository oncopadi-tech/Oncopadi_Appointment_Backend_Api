import SaveProfileValidator from 'App/Validators/People/SaveProfileValidator'
import UpdateUser from '../User/Update'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import ProfileField from 'App/Models/People/ProfileField'
import ProfileDatum from 'App/Models/People/ProfileDatum'
import CreateActivity from 'App/Repos/Misc/Activity/Create'
import { slugify } from 'App/Helpers/Index'

export default class Save {
  async handle(
    data: typeof SaveProfileValidator.parsedSchema.props,
    auth: AuthContract
  ) {
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
          'image',
          'username'
        ].includes(key)
      ) {
        userData[key] = data[key]
      }
    }

    const profileFields = await ProfileField.query().where('active', true)

    const user = await new UpdateUser().handle(data.userId, userData, auth)

    var profileData = new Array<ProfileDatum>()
    const roles = await user.related('roles').query()

    for (const datum of data.data || []) {
      var field = profileFields.find((field) => field.code === datum.field)
      if (!field) {
        field = await ProfileField.firstOrCreate(
          {
            code: slugify(datum.field)
          },
          {
            name: datum.field,
            category: datum.fieldCategory ? datum.fieldCategory : 'medical'
          }
        )
        await field.related('roles').attach(roles.map((role) => role.id))
      }

      profileData.push(
        await ProfileDatum.updateOrCreate(
          { profileFieldId: field.id, userId: user.id },
          { value: datum.value }
        )
      )
    }

    await new CreateActivity().handle('Your profile was updated', { user })

    return { profileData, user }
  }
}
