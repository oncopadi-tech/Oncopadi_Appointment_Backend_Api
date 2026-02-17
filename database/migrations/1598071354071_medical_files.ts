import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MedicalFiles extends BaseSchema {
  protected tableName = 'medical_files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
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
