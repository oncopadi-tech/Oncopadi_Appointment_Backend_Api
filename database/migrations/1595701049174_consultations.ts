import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Consultations extends BaseSchema {
  protected tableName = 'consultations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('enquiry').nullable()
      table.dateTime('starts_at').nullable()
      table.dateTime('ended_at').nullable()
      table.float('price', 20, 2).nullable()
      table.string('currency', 10).defaultTo('NGN')
      table.text('notes').nullable()
      table.text('prescription').nullable()
      table.text('summary').nullable()
      table.string('twilio_room').nullable()
      table
        .integer('doctor_id')
        .unsigned()
        .references('id')
        .inTable('doctors')
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
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('consultation_status_id')
        .unsigned()
        .references('id')
        .inTable('consultation_statuses')
        .nullable()
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
