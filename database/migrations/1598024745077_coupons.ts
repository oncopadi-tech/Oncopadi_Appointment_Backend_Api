import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Coupons extends BaseSchema {
  protected tableName = 'coupons'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code').nullable()
      table.boolean('active').defaultTo(true)
      table.dateTime('expires_at').nullable()
      table.dateTime('used_at').nullable()
      table
        .integer('used_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('subscription_plan_id')
        .unsigned()
        .references('id')
        .inTable('subscription_plans')
        .nullable()
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
