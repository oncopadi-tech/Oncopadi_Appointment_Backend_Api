import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ConsultationStatuses extends BaseSchema {
  protected tableName = 'consultation_statuses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).nullable()
      table.string('code', 100).nullable()
      table.boolean('active').defaultTo(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
