import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DiseaseStages extends BaseSchema {
  protected tableName = 'disease_stages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.string('code').nullable()
      table.timestamps(true, true)
    })

    this.schema.alterTable('medical_conditions', (table) => {
      table
        .integer('disease_stage_id')
        .unsigned()
        .references('id')
        .inTable('disease_stages')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable('medical_conditions', (table) => {
      table.dropForeign(['disease_stage_id'])
      table.dropColumn('disease_stage_id')
    })
    this.schema.dropTable(this.tableName)
  }
}
