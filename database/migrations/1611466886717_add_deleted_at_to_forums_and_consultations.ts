import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddDeletedAtToForumsAndConsultations extends BaseSchema {
  public async up() {
    this.schema.alterTable('consultations', (table) => {
      table.dateTime('deleted_at').nullable()
    })

    this.schema.alterTable('forums', (table) => {
      table.dateTime('deleted_at').nullable()
    })
  }

  public async down() {
    this.schema.alterTable('consultations', (table) => {
      table.dropColumn('deleted_at')
    })

    this.schema.alterTable('forums', (table) => {
      table.dropColumn('deleted_at')
    })
  }
}
