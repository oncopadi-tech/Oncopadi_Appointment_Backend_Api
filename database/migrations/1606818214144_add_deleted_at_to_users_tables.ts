import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddDeletedAtToUsersTables extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime('deleted_at').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('deleted_at')
    })
  }
}
