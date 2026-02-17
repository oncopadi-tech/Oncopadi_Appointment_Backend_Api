import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddUsernameToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('username').unique().nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('username')
    })
  }
}
