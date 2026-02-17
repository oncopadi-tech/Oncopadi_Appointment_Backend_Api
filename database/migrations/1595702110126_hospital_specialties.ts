import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class HospitalSpecialties extends BaseSchema {
  protected tableName = 'hospital_specialty'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('hospital_id')
        .unsigned()
        .references('id')
        .inTable('hospitals')
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
