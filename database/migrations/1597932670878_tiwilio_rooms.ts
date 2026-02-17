import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TiwilioRooms extends BaseSchema {
  protected tableName = 'twilio_rooms'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.string('sid').nullable()
      table
        .integer('consultation_id')
        .unsigned()
        .references('id')
        .inTable('consultations')
        .nullable()
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })

    this.schema.alterTable('consultations', (table) => {
      table.dropColumn('twilio_room')
    })
  }

  public async down() {
    this.schema.alterTable('consultations', (table) => {
      table.string('twilio_room').nullable()
    })

    this.schema.dropTable(this.tableName)
  }
}
