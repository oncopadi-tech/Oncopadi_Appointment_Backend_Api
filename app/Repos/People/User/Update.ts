import UpdateUserValidator from 'App/Validators/People/UpdateUserValidator'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/People/User'
import { getRoleCodes, slugify } from 'App/Helpers/Index'
import { Exception } from '@poppinss/utils'
import GCS from 'App/Services/GCS'
import logger from '@ioc:Adonis/Core/Logger'
import Specialty from 'App/Models/Medical/Specialty'

export default class Update {
  async handle(
    id,
    data: typeof UpdateUserValidator.parsedSchema.props & {
      relationships?: Array<string>
    },
    auth?: AuthContract
  ) {
    var user = await User.query()
      .apply((scopes) => scopes.byUser(auth?.user))
      .where('id', id)
      .orWhere('email', id)
      .orWhere('phone', id)
      .firstOrFail()

    var duplicateUserQuery = User.query().whereNot('id', user.id)
    if (data.email && data.phone && data.username) {
      duplicateUserQuery
        .where('email', data.email)
        .orWhere('phone', data.phone)
        .orWhere('username', data.username)
    } else if (data.email) {
      duplicateUserQuery.where('email', data.email)
    } else if (data.phone) {
      duplicateUserQuery.where('phone', data.phone)
    } else if (data.username) {
      duplicateUserQuery.where('username', data.username)
    } else {
      duplicateUserQuery.whereNull('id')
    }

    const duplicateUser = await duplicateUserQuery.first()

    if (duplicateUser)
      throw new Exception('new email or phone number not unique', 400)

    for (const key in data) {
      if (
        [
          'attachedRoleIds',
          'detachedRoleIds',
          'id',
          'image',
          'cancerType'
        ].includes(key)
      )
        continue
      user[key] = typeof data[key] !== 'undefined' ? data[key] : user[key]
    }

    if (data.image) {
      try {
        if (user.image) {
          try {
            await new GCS().deleteFile(user.image)
          } catch (error) {
            logger.error(error)
          }
        }
        user.image = (
          await new GCS().uploadFile(data.image, `users/${user.id}`)
        ).filePath
      } catch (error) {
        logger.error(error)
      }
    }

    if (data.cancerType) {
      const specialty = await Specialty.firstOrCreate(
        { code: slugify(data.cancerType) },
        { name: data.cancerType }
      )
      user.cancerTypeId = specialty.id
    }

    await user.save()

    if (getRoleCodes(auth?.user).includes('administrator')) {
      if (data.attachedRoleIds)
        await user.related('roles').attach(data.attachedRoleIds)
      if (data.detachedRoleIds)
        await user.related('roles').detach(data.detachedRoleIds)
    }

    return user
  }
}
