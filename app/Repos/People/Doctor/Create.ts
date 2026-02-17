import CreateDoctorValidator from 'App/Validators/People/CreateDoctorValidator'
import Doctor from 'App/Models/People/Doctor'
import CreateUser from 'App/Repos/People/User/Create'
import { Exception } from '@poppinss/utils'
import UpdateUser from '../User/Update'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'

export default class Create {
  async handle(
    {
      title,
      folioNumber,
      bio,
      bankAccountNumber,
      bankAccountName,
      bankName,
      userId,
      name,
      email,
      phone,
      address,
      gender,
      dateOfBirth,
      image
    }: typeof CreateDoctorValidator.parsedSchema.props,
    auth?: AuthContract
  ) {
    await auth?.user?.preload('roles')
    if (typeof userId === 'undefined') {
      if (!email)
        throw new Exception('please fill in name and email address', 422)
      const user = await new CreateUser().handle({
        name,
        email,
        phone,
        address,
        gender,
        password: undefined,
        dateOfBirth,
        roles: ['doctor'],
        image,
        cancerType: undefined
      })
      userId = user.id
    } else {
      await new UpdateUser().handle(
        userId,
        {
          name,
          email,
          phone,
          address,
          gender,
          dateOfBirth,
          username: undefined,
          active: undefined,
          attachedRoleIds: undefined,
          detachedRoleIds: undefined,
          password: undefined,
          image: undefined,
          cancerType: undefined
        },
        auth
      )
    }

    const doctor = Doctor.firstOrCreate(
      { userId },
      { title, folioNumber, bio, bankAccountName, bankAccountNumber, bankName }
    )

    return doctor
  }
}
