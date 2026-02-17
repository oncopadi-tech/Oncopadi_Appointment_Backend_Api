import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Doctors extends BaseSchema {
  protected tableName = 'doctors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 100).nullable()
      table.string('folio_number', 100).nullable()
      table.text('bio').nullable()
      table.string('bank_account_number', 30).nullable()
      table.string('bank_account_name', 100).nullable()
      table.string('bank_name', 50).nullable()
      table.boolean('active').defaultTo(true)
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
