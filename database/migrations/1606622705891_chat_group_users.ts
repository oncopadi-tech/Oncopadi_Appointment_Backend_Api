import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChatGroupUsers extends BaseSchema {
  protected tableName = 'chat_group_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('chat_group_id')
        .unsigned()
        .references('id')
        .inTable('chat_groups')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
