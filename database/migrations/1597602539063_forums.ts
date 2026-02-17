import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Forums extends BaseSchema {
  protected tableName = 'forums'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.string('slug').nullable()
      table.text('description').nullable()
      table.boolean('active').defaultTo(true)
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
