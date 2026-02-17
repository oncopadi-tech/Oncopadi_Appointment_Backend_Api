import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DiseaseGrades extends BaseSchema {
  protected tableName = 'disease_grades'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.string('code').nullable()
      table.timestamps(true, true)
    })

    this.schema.alterTable('medical_conditions', (table) => {
      table
        .integer('disease_grade_id')
        .unsigned()
        .references('id')
        .inTable('disease_grades')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable('medical_conditions', (table) => {
      table.dropForeign(['disease_grade_id'])
      table.dropColumn('disease_grade_id')
    })
    this.schema.dropTable(this.tableName)
  }
}
