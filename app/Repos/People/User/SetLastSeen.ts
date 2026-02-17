import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { Exception } from '@poppinss/utils'
import User from 'App/Models/People/User'
import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'

export default class SetLastSeen {
  public static async handle(auth: AuthContract | { user: User }) {
    if (!auth.user) throw new Exception('user needs to be logged in', 401)

    auth.user.lastSeen = DateTime.local()

    await auth.user.save()

    Event.emit('user/last-seen-set', { user: auth.user })

    return auth.user
  }
}
