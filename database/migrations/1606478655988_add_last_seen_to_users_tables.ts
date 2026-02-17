import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddLastSeenToUsersTables extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime('last_seen').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('last_seen')
    })
  }
}
