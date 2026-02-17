import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Enquiries extends BaseSchema {
  protected tableName = 'enquiries'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email').nullable()
      table.string('title').nullable()
      table.text('message').nullable()
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
