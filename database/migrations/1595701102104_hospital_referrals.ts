import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class HospitalReferrals extends BaseSchema {
  protected tableName = 'hospital_referrals'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('comment').nullable()
      table
        .integer('consultation_id')
        .unsigned()
        .references('id')
        .inTable('consultations')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('patient_id')
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
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
