import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ForumMessages extends BaseSchema {
  protected tableName = 'forum_messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('message').nullable()
      table
        .integer('forum_id')
        .unsigned()
        .references('id')
        .inTable('forums')
        .nullable()
        .onDelete('CASCADE')
      table.integer('reply_to').nullable()
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
