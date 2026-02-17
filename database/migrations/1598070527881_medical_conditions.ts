import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MedicalConditions extends BaseSchema {
  protected tableName = 'medical_conditions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('diagnosis').nullable()
      table.dateTime('date').nullable()
      table.string('diagnosis_centre').nullable()
      table.string('doctor').nullable()
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
