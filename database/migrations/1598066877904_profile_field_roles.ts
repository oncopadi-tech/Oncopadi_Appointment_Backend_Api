import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProfileFieldRoles extends BaseSchema {
  protected tableName = 'profile_field_role'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('profile_field_id')
        .unsigned()
        .references('id')
        .inTable('profile_fields')
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
