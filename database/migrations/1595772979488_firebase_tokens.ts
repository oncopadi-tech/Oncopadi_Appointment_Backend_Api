import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FirebaseTokens extends BaseSchema {
  protected tableName = 'firebase_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('token').nullable()
      table.string('app', 20).defaultTo('app')
      table
        .integer('user_id')
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
