import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DoctorHospitals extends BaseSchema {
  protected tableName = 'doctor_hospital'

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
        .integer('hospital_id')
        .unsigned()
        .references('id')
        .inTable('hospitals')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
