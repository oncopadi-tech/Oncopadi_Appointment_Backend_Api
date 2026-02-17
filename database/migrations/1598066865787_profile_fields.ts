import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProfileFields extends BaseSchema {
  protected tableName = 'profile_fields'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.string('code').nullable()
      table.string('category').nullable()
      table.boolean('active').defaultTo(true)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
