import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Vitals extends BaseSchema {
  protected tableName = 'vitals'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.string('code').nullable()
      table.boolean('active').defaultTo(true)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
