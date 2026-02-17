import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FixMedicalFiles extends BaseSchema {
  protected tableName = 'medical_files'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['medical_condition_id'])
      table.dropColumn('medical_condition_id')
      table.string('description')
      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('medical_condition_id')
        .unsigned()
        .references('id')
        .inTable('medical_conditions')
        .nullable()
        .onDelete('CASCADE')
      table.dropColumn('description')
      table.dropForeign(['created_by'])
      table.dropColumn('created_by')
    })
  }
}
