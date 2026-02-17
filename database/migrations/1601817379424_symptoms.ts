import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Symptoms extends BaseSchema {
  protected tableName = 'symptoms'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('symptoms').nullable()
      table.dateTime('date').nullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('specialty_id')
        .unsigned()
        .references('id')
        .inTable('specialties')
        .nullable()
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
