import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@poppinss/utils'
import { getCurrentRoute } from 'App/Helpers/Index'
import Permission from 'App/Models/People/Permission'

export default class PermissionCheck {
  public async handle(
    { auth, request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    if (!auth.user) throw new Exception('Access Denied!', 403)

    await auth.user.preload('roles', (query) => query.preload('permissions'))

    const currentRoute = getCurrentRoute(request)

    const permissions = auth.user.roles.reduce(
      (permissions, role) => permissions.concat(role.permissions),
      new Array<Permission>()
    )

    const permission = permissions.find(
      (permission) => permission.code === currentRoute?.name
    )

    if (!permission) throw new Exception('Access Denied!', 403)

    await next()
  }
}
