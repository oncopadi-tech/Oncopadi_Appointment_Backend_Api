import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ForumMessageViews extends BaseSchema {
  protected tableName = 'forum_message_views'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('forum_message_id')
        .unsigned()
        .references('id')
        .inTable('forum_messages')
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
