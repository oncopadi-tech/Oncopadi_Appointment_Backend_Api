import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Hospitals extends BaseSchema {
  protected tableName = 'hospitals'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.string('email', 255).nullable()
      table.string('phone', 100).nullable()
      table.text('address').nullable()
      table.text('description').nullable()
      table.boolean('active').defaultTo(true)
      table
        .integer('created_by')
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
