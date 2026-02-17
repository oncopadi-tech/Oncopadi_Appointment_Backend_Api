import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Permissions extends BaseSchema {
  protected tableName = 'permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).nullable()
      table.string('code', 100).nullable()
      table.boolean('active').defaultTo(true)
      table
        .integer('entity_id')
        .unsigned()
        .references('id')
        .inTable('entities')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
