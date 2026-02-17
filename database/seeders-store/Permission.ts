import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import permissionsConfig from 'Config/permissions'
import Entity from 'App/Models/Misc/Entity'
import Permission from 'App/Models/People/Permission'
import Role from 'App/Models/People/Role'
import Database from '@ioc:Adonis/Lucid/Database'
import logger from '@ioc:Adonis/Core/Logger'
import { namePermission } from 'App/Helpers/Index'

export default class PermissionSeeder extends BaseSeeder {
  public static async run() {
    logger.info('seeding permissions')

    const entities = await Entity.all()
    const permissions = await Permission.all()
    const roles = await Role.all()

    const permissionsToCreate = new Array<{
      permission: Partial<Permission>
      roleIds: Array<number>
    }>()

    for (const entity of entities) {
      for (const action in permissionsConfig[entity.code]) {
        const permission = `${entity.code}.${action}`

        const existingPermission = permissions.find(
          (search) => search.code === permission
        )

        if (existingPermission) continue

        const roleIds = roles
          .filter((role) =>
            permissionsConfig[entity.code][action].includes(role.code)
          )
          .map((role) => role.id)

        permissionsToCreate.push({
          permission: {
            name: namePermission(entity.code, action),
            code: permission,
            entityId: entity.id
          },
          roleIds
        })
      }
    }

    const newPermissions = await Permission.createMany(
      permissionsToCreate.map((permission) => permission.permission)
    )

    const rolePermissions = new Array<{
      role_id: number
      permission_id: number
    }>()

    for (const permissionToCreate of permissionsToCreate) {
      const permissionCreated = newPermissions.find(
        (permission) => permissionToCreate.permission.code === permission.code
      )
      if (!permissionCreated) continue

      permissionToCreate.roleIds.forEach((role_id) => {
        rolePermissions.push({ role_id, permission_id: permissionCreated.id })
      })
    }

    await Database.table('permission_role').multiInsert(rolePermissions)

    logger.info('done seeding permissions')
  }
}
