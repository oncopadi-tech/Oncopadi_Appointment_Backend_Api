import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Medications extends BaseSchema {
  protected tableName = 'medications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.dateTime('start_date').nullable()
      table.string('dosage').nullable()
      table.string('reason').nullable()
      table.string('prescriber').nullable()
      table.string('side_efects').nullable()
      table
        .integer('file_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .nullable()
        .onDelete('CASCADE')
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
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
