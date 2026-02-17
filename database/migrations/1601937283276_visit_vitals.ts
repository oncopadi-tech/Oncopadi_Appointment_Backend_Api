import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class VisitVitals extends BaseSchema {
  protected tableName = 'visit_vitals'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('value').nullable()
      table
        .integer('hospital_visit_id')
        .unsigned()
        .references('id')
        .inTable('hospital_visits')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('vital_id')
        .unsigned()
        .references('id')
        .inTable('vitals')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
