import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Treatments extends BaseSchema {
  protected tableName = 'treatments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('details').nullable()
      table.dateTime('date').nullable()
      table
        .integer('medical_condition_id')
        .unsigned()
        .references('id')
        .inTable('medical_conditions')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('doctor_id')
        .unsigned()
        .references('id')
        .inTable('doctors')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('hospital_id')
        .unsigned()
        .references('id')
        .inTable('hospitals')
        .nullable()
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
