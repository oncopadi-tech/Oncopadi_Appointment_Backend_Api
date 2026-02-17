import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ForumTopics extends BaseSchema {
  protected tableName = 'forum_topic'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('forum_id')
        .unsigned()
        .references('id')
        .inTable('forums')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('topic_id')
        .unsigned()
        .references('id')
        .inTable('topics')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
