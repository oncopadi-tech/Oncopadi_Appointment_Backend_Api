import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ConsultationAttendances extends BaseSchema {
  protected tableName = 'consultation_attendances'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('consultation_id')
        .unsigned()
        .references('id')
        .inTable('consultations')
        .nullable()
        .onDelete('CASCADE')
      table.dateTime('confirmed_at').nullable()
      table.dateTime('joined_at').nullable()
      table.dateTime('left_at').nullable()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
