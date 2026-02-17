import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddReplyToEnquiries extends BaseSchema {
  protected tableName = 'enquiries'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime('seen_at').nullable()
      table
        .integer('reply_to')
        .unsigned()
        .references('id')
        .inTable('enquiries')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('sent_to')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['reply_to'])
      table.dropColumn('reply_to')
    })
  }
}
