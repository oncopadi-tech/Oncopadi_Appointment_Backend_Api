import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PermissionRoles extends BaseSchema {
  protected tableName = 'permission_role'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('permission_id')
        .unsigned()
        .references('id')
        .inTable('permissions')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
