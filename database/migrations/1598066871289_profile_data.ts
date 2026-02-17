import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProfileData extends BaseSchema {
  protected tableName = 'profile_data'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('value').nullable()
      table
        .integer('profile_field_id')
        .unsigned()
        .references('id')
        .inTable('profile_fields')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
