import Role from 'App/Models/People/Role'

export default class Update {
  async handle(id: number, { name, attachedPermissions, detachedPermissions }) {
    var role = await Role.findOrFail(id)

    role.name = typeof name !== 'undefined' ? name : role.name

    await role.save()

    if (typeof attachedPermissions !== 'undefined')
      await role.related('permissions').attach(attachedPermissions)

    if (typeof detachedPermissions !== 'undefined') {
      if (detachedPermissions.length > 0) {
        await role.related('permissions').detach(detachedPermissions)
      }
    }

    return role
  }
}
