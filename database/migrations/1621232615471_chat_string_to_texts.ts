import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChatStringToTexts extends BaseSchema {
  protected tableName = 'chats'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('message').nullable().alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('message').nullable().alter()
    })
  }
}
