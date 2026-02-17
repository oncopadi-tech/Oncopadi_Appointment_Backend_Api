import CreateUserValidator from 'App/Validators/People/CreateUserValidator'
import User from 'App/Models/People/User'
import Role from 'App/Models/People/Role'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { Exception } from '@poppinss/utils'
import Event from '@ioc:Adonis/Core/Event'
import logger from '@ioc:Adonis/Core/Logger'
import GCS from 'App/Services/GCS'
import { slugify } from 'App/Helpers/Index'
import Specialty from 'App/Models/Medical/Specialty'
import { DateTime } from 'luxon'

export default class Create {
  async handle(
    {
      name,
      email,
      phone,
      password,
      address,
      gender,
      dateOfBirth,
      roles = [],
      image,
      cancerType
    }: typeof CreateUserValidator.parsedSchema.props,
    auth?: AuthContract,
    seeding?: boolean
  ) {
    if (!auth?.user && roles.includes('administrator') && !seeding)
      throw new Exception('You are not allowed to create an administrator', 403)

    if (!password) password = Math.floor(1000 + Math.random() * 9000).toString()

    var cancerTypeId
    if (cancerType) {
      cancerTypeId = (
        await Specialty.firstOrCreate(
          { code: slugify(cancerType) },
          { name: cancerType }
        )
      ).id
    }

    const user = await User.firstOrCreate(
      { email },
      {
        name,
        phone,
        password,
        address,
        gender,
        dateOfBirth,
        cancerTypeId,
        lastSeen: DateTime.local()
      }
    )

    const roleIds = (await Role.query().whereIn('code', roles)).map(
      (role) => role.id
    )

    await user.related('roles').sync(roleIds)

    if (image) {
      try {
        user.image = (
          await new GCS().uploadFile(image, `users/${user.id}`)
        ).filePath
      } catch (error) {
        logger.error(error)
      }
    }

    await user.save()

    Event.emit('user/created', { password, user })

    return user
  }
}
