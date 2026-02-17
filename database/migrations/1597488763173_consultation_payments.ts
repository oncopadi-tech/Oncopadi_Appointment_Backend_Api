import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ConsultationPayments extends BaseSchema {
  protected tableName = 'consultation_payment'

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
        .integer('payment_id')
        .unsigned()
        .references('id')
        .inTable('payments')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
