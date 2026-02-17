import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DoctorSpecialties extends BaseSchema {
  protected tableName = 'doctor_specialty'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('doctor_id')
        .unsigned()
        .references('id')
        .inTable('doctors')
        .nullable()
        .onDelete('CASCADE')
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
    this.schema.dropTable(this.tableName)
  }
}
