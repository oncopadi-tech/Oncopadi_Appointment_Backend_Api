import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Cormobidities extends BaseSchema {
  protected tableName = 'comorbidities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.string('code').nullable()
      table.timestamps(true, true)
    })

    this.schema.alterTable('medical_conditions', (table) => {
      table
        .integer('comorbidity_id')
        .unsigned()
        .references('id')
        .inTable(this.tableName)
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable('medical_conditions', (table) => {
      table.dropForeign(['comorbidity_id'])
      table.dropColumn('comorbidity_id')
    })
    this.schema.dropTable(this.tableName)
  }
}
