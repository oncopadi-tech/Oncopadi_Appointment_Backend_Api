import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MedicalConditionsChanges extends BaseSchema {
  public async up() {
    this.schema.alterTable('medical_conditions', (table) => {
      table.renameColumn('diagnosis_centre', 'centre')
      table.integer('age_at_diagnosis').nullable()
      table.string('histology').nullable()
      table.dropColumn('doctor')
      table
        .integer('specialty_id')
        .unsigned()
        .references('id')
        .inTable('specialties')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable('medical_conditions', (table) => {
      table.renameColumn('centre', 'diagnosis_centre')
      table.dropColumn('age_at_diagnosis')
      table.dropColumn('histology')
      table.string('doctor').nullable()
      table.dropForeign(['specialty_id'])
      table.dropColumn('specialty_id')
    })
  }
}
