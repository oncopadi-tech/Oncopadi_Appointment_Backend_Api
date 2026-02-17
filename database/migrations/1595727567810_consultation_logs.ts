import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ConsultationLogs extends BaseSchema {
  protected tableName = 'consultation_logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('consultation_id')
        .unsigned()
        .references('id')
        .inTable('consultations')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('comment_id')
        .unsigned()
        .references('id')
        .inTable('comments')
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
