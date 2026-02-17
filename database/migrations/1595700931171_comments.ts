import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Comments extends BaseSchema {
  protected tableName = 'comments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').nullable()
      table.text('text').nullable()
      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
