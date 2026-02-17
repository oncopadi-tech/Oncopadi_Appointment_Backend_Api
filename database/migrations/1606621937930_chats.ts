import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Chats extends BaseSchema {
  protected tableName = 'chats'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('message').nullable()
      table
        .integer('chat_group_id')
        .unsigned()
        .references('id')
        .inTable('chat_groups')
        .nullable()
        .onDelete('CASCADE')
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
