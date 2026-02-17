import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChatFiles extends BaseSchema {
  protected tableName = 'chat_file'

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
        .integer('file_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
