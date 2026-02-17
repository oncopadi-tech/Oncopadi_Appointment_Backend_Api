import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChatViews extends BaseSchema {
  protected tableName = 'chat_views'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('chat_id')
        .unsigned()
        .references('id')
        .inTable('chats')
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
