import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddSpecialtyIdToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('cancer_type_id')
        .unsigned()
        .references('id')
        .inTable('specialties')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['cancer_type_id'])
      table.dropColumn('cancer_type_id')
    })
  }
}
