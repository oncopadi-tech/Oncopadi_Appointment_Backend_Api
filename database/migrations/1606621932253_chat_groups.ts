import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChatGroups extends BaseSchema {
  protected tableName = 'chat_groups'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.string('code').nullable()
      table.boolean('active').defaultTo(true)
      table.boolean('group').defaultTo(false)
      table
        .integer('created_by')
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
